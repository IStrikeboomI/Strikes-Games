package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.LobbyNotFoundException;
import Strikeboom.StrikesGames.exception.UserInsufficientPermissions;
import Strikeboom.StrikesGames.exception.UserNotFoundException;
import Strikeboom.StrikesGames.exception.UserUnableToJoinException;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.websocket.message.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class LobbyService {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;
    public Lobby createLobby(LobbyDto lobbyDto) {
        return lobbyRepository.save(map(lobbyDto));
    }
    public void joinLobby(Lobby lobby, User user) {
        if (lobby.getUsers().size() < lobby.getMaxPlayers()) {
            if (!isUserInLobby(user,lobby)) {
                userRepository.save(user);
                user.setLobby(lobby);
                lobby.getUsers().add(user);
                lobbyRepository.save(lobby);
            } else {
                throw new UserUnableToJoinException("User is already in lobby!");
            }
        } else {
            throw new UserUnableToJoinException("Lobby is full!");
        }
    }
    @Transactional(readOnly = true)
    public boolean doesLobbyExist(String joinCode) {
        return lobbyRepository.findLobbyFromJoinCode(joinCode).isPresent();
    }
    public LobbyDto getLobbyFromJoinCode(String joinCode) {
        return mapToDto(lobbyRepository.findLobbyFromJoinCode(joinCode).orElseThrow(() -> new LobbyNotFoundException(String.format("Lobby with join code: %s not found",joinCode))));
    }
    public LobbyDto getLobbyFromId(long id) {
        return mapToDto(lobbyRepository.findById(id).orElseThrow(() -> new LobbyNotFoundException(String.format("Lobby with id: %s not found",id))));
    }
    public static LobbyDto mapToDto(Lobby lobby) {
        return LobbyDto.builder()
                .created(lobby.getCreated())
                .game(lobby.getGame())
                .isPrivate(lobby.isPrivate())
                .maxPlayers(lobby.getMaxPlayers())
                .name(lobby.getName())
                .joinCode(lobby.getJoinCode())
                .users(lobby.getUsers().stream().map(UserService::mapToDto).toList())
                .gameStarted(lobby.isGameStarted())
                .build();
    }
    //called only on creation of lobby
    private Lobby map(LobbyDto lobby) {
        return Lobby.builder()
                .created(Instant.now())
                .game(lobby.getGame())
                .isPrivate(lobby.isPrivate())
                .maxPlayers(lobby.getMaxPlayers())
                .name(lobby.getName())
                .joinCode(generateValidJoinCode())
                .users(new ArrayList<>())
                .gameStarted(false)
                .build();
    }
    //characters allowed in the join code URL
    private static final char[] VALID_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();
    private static String generateJoinCode() {
        StringBuilder builder = new StringBuilder(7);
        Random random = new Random();
        for (int i = 0;i < builder.capacity();i++) {
            builder.append(VALID_CHARACTERS[random.nextInt(VALID_CHARACTERS.length)]);
        }
        return builder.toString();
    }
    //used to make sure we don't generate a duplicate join code
    @Transactional(readOnly = true)
    private String generateValidJoinCode() {
        String joinCode = generateJoinCode();
        while (lobbyRepository.findLobbyFromJoinCode(joinCode).isPresent()) {joinCode = generateJoinCode();}
        return joinCode;
    }
    public boolean isUserInLobby(User user, Lobby lobby) {
        return lobby.getUsers().contains(user);
    }
    public void removeUserFromLobby(User user) {
        user.getLobby().getUsers().remove(user);
        lobbyRepository.save(user.getLobby());
        user.setLobby(null);
        userRepository.save(user);
    }
    private void sendWebsocketMessage(String joinCode, LobbyMessage message) {
        simpMessagingTemplate.convertAndSend(String.format("/broker/%s",joinCode),message);
    }
    //check every hour for the expired lobbies (lobbies created 7 days ago) and delete
    @Scheduled(fixedRate = 1000*60*60)
    private void deleteExpiredLobbies() {
        List<Lobby> expiredLobbies = lobbyRepository.findLobbiesMadeSince(Instant.now().minus(7, ChronoUnit.DAYS));
        lobbyRepository.deleteAll(expiredLobbies);
    }
    //below is everything to be received by websockets

    /**
     *
     * @param name new name
     * @param userId user that's changing the name
     */
    public void changeName(String name, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        Lobby lobby = user.getLobby();
        user.setName(name);
        userRepository.save(user);
        sendWebsocketMessage(lobby.getJoinCode(),new UserChangedNameMessage(user.getSeparationId(), name));
    }

    /**
     * Kicks specified user from lobby
     * @param playerGettingKickedId separationId of the user getting kicked
     * @param userId user that is doing the kicking, has to be creator
     */
    public void kickUser(UUID playerGettingKickedId, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        if (user.isCreator()) {
            Lobby lobby = user.getLobby();
            User userGettingKicked = lobby.getUsers().stream().filter(user1 -> user1.getSeparationId().equals(playerGettingKickedId)).findFirst()
                    .orElseThrow(() -> new UserNotFoundException(String.format("User with Id:%s Is In Different lobby!",playerGettingKickedId.toString())));
            lobby.getUsers().remove(userGettingKicked);
            userRepository.delete(userGettingKicked);
            lobbyRepository.save(lobby);
            sendWebsocketMessage(lobby.getJoinCode(),new UserKickedMessage(UserService.mapToDto(userGettingKicked)));
        } else {
            throw new UserInsufficientPermissions("Only Lobby Creators Can Kick Users!");
        }
    }

    /**
     * Called when a user gets disconnected and gives the user a 60 second grace period to join back
     * @param userId User that got disconnected
     */
    public void userDisconnected(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        user.setDisconnected(true);
        userRepository.save(user);
        sendWebsocketMessage(user.getLobby().getJoinCode(),new UserDisconnectedMessage(UserService.mapToDto(user)));
    }
    /**
     * Called when a user gets reconnected
     * @param user User that got reconnected
     */
    public void userReconnected(User user) {
        user.setDisconnected(false);
        userRepository.save(user);
        sendWebsocketMessage(user.getLobby().getJoinCode(),new UserReconnectedMessage(UserService.mapToDto(user)));
    }
}
