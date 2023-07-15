package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.LobbyDto;
import Strikeboom.StrikesGames.entity.ChatMessage;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.*;
import Strikeboom.StrikesGames.game.Game;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import Strikeboom.StrikesGames.websocket.message.lobby.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.lang.reflect.InvocationTargetException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class LobbyService {
    private  SimpMessagingTemplate simpMessagingTemplate;

    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;

    private final ChatService chatService;
    private final UserService userService;

    //Map for storing game instances instead of saving to database
    //Long is lobby id and Game is game's instance
    private final Map<Long,Game> gameInstances;

    public Lobby createLobby(LobbyDto lobbyDto) {
        return lobbyRepository.save(map(lobbyDto));
    }
    public void joinLobby(Lobby lobby, User user) {
        if (lobby.getUsers().size() < lobby.getMaxPlayers()) {
            if (!isUserInLobby(user,lobby)) {
                if (doesLobbyHavePlayerWithName(user.getName(),lobby)) {
                    int appendedNumberToName = 1;
                    while (doesLobbyHavePlayerWithName(user.getName()+appendedNumberToName,lobby)) {
                        appendedNumberToName++;
                    }
                    user.setName(user.getName() + appendedNumberToName);
                }
                userRepository.save(user);
                user.setLobby(lobby);
                lobby.getUsers().add(user);
            } else {
                throw new UserUnableToJoinException("User is already in lobby!");
            }
        } else {
            throw new UserUnableToJoinException("Lobby is full!");
        }
    }
    public boolean doesLobbyHavePlayerWithName(String name, Lobby lobby) {
        for (User user : lobby.getUsers()) {
            if (user.getName().equals(name)) {
                return true;
            }
        }
        return false;
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
                .messages(lobby.getMessages().stream().map(ChatService::mapToDto).toList())
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
                .name(HtmlUtils.htmlEscape(lobby.getName()))
                .joinCode(generateValidJoinCode())
                .users(new ArrayList<>())
                .messages(new ArrayList<>())
                .gameStarted(false)
                .build();
    }

    //The 2 functions below generate the join code for the lobby
    //The join code is the section after /join/ in the url
    //It's made up of 7 random characters that are the 26 lower case letters, 26 upper case letters, and 10 numbers

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

    /**
     * Removes (not deletes) user from lobby <br>
     * Separate from the delete user method in UserService because that one deletes it from the repository
     * @param user user to remove
     */
    public void removeUserFromLobby(User user) {
        user.getLobby().getUsers().remove(user);
        user.setLobby(null);
    }

    /**
     * Helper method to write less code <br>
     * Sends a websocket message to everyone in the lobby
     * @param lobby lobby to send message in
     * @param message lobby message to send based off the abstract class {@link LobbyMessage}
     */
    public void sendWebsocketMessage(Lobby lobby, LobbyMessage message) {
        for (User u : lobby.getUsers()) {
            simpMessagingTemplate.convertAndSendToUser(u.getId().toString(),String.format("/broker/%s", lobby.getJoinCode()), message);
        }
    }
    //check every hour for the expired lobbies (lobbies created 7 days ago) and delete
    @Scheduled(fixedRate = 1000*60*60)
    private void deleteExpiredLobbies() {
        List<Lobby> expiredLobbies = lobbyRepository.findLobbiesMadeSince(Instant.now().minus(7, ChronoUnit.DAYS));
        lobbyRepository.deleteAll(expiredLobbies);
    }
    public void sendGameInitMessages(User user) {
        if (user.getLobby().isGameStarted() && gameInstances.containsKey(user.getLobby().getId())) {
            gameInstances.get(user.getLobby().getId()).initMessages(user);
        }
    }
    public void sendGameInitMessages(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        sendGameInitMessages(user);
    }
    //below is everything to be received by websockets by LobbyWebSocketController
    /**
     *
     * @param name new name
     * @param userId user that's changing the name
     */
    public void changeName(String name, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        Lobby lobby = user.getLobby();
        if (!doesLobbyHavePlayerWithName(name,lobby)) {
            user.setName(HtmlUtils.htmlEscape(name));
            sendWebsocketMessage(lobby, new UserChangedNameMessage(user.getSeparationId(), user.getName()));
        }
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
            sendWebsocketMessage(lobby,new UserKickedMessage(userGettingKicked.getSeparationId()));
            userService.deleteUser(userGettingKicked);
        } else {
            throw new UserInsufficientPermissions("Only Lobby Creators Can Kick Users!");
        }
    }

    /**
     * Recives a chat message and relays it to rest of the lobby
     * @param message chat message that gets sent by user
     * @param userId user that sent message
     */
    public void sendMessage(String message, UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        Lobby lobby = user.getLobby();
        ChatMessage chatMessage = ChatMessage.builder()
                .created(Instant.now())
                .lobby(lobby)
                .user(user)
                .text(HtmlUtils.htmlEscape(message))
                .build();
        chatService.addMessage(chatMessage);
        sendWebsocketMessage(lobby,new UserSentMessageMessage(ChatService.mapToDto(chatMessage)));
    }
    /**
     *  Starts off the game for the lobby, can only be sent by lobby creator
     * @param userId user that sent message
     */
    public void start(UUID userId) throws InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        if (user.isCreator()) {
            Lobby lobby = user.getLobby();
            if (lobby.getUsers().size() >= Objects.requireNonNull(Games.getGame(lobby.getGame())).minPlayers()) {
                if (!lobby.isGameStarted()) {
                    lobby.setGameStarted(true);
                    sendWebsocketMessage(lobby, new GameStartedMessage());
                    Game instance = Game.newInstance(lobby, simpMessagingTemplate);
                    gameInstances.put(lobby.getId(), instance);
                    for (User u : lobby.getUsers()) {
                        instance.initMessages(u);
                    }
                } else {
                    throw new GameAlreadyStartedException("Game already started!");
                }
            } else {
                throw new NotEnoughPlayersException("Not enough players to start!");
            }
        } else {
            throw new UserInsufficientPermissions("User must be the creator to start game!");
        }
    }

    /**
     * Restarts game <br>
     * Can only work if the current game has been ended
     * @param userId user that sent message
     */
    public void restart(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        if (user.isCreator()) {
            Lobby lobby = user.getLobby();
            if (gameInstances.containsKey(lobby.getId())) {
                Game instance = gameInstances.get(lobby.getId());
                if (instance.gameEnded) {
                    lobby.setGameStarted(false);
                    sendWebsocketMessage(lobby, new GameRestartedMessage());
                }
            }
        }
    }

    /**
     * Handles game message
     * @param userId user that sent message
     * @param game game that message should be sent for
     * @param messageName name of message
     * @param message message data
     */
    public void receiveGameMessage(UUID userId, String game, String messageName, GameMessage message) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        Lobby lobby = user.getLobby();
        Game gameInstance = gameInstances.get(lobby.getId());
        if (gameInstance.getGameInfo().name().equalsIgnoreCase(game) && !gameInstance.gameEnded) {
            GameMessageHandler<Game> handler = (GameMessageHandler<Game>) gameInstance.getMessageHandler(messageName, message);
            if (handler.handle(gameInstance, user)) {
                if (handler.canDispatch(gameInstance, user)) {
                    gameInstance.sendMessageToUsers(handler.dispatch(gameInstance,user),handler.dispatchTo(gameInstance).toArray(new User[0]));
                }
                handler.postHandle(gameInstance,user);
            }
        }
    }
}
