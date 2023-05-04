package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.UserDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.UserNotFoundException;
import Strikeboom.StrikesGames.repository.ChatRepository;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.websocket.message.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class UserService {
    private SimpMessagingTemplate simpMessagingTemplate;

    private final UserRepository userRepository;
    private final LobbyRepository lobbyRepository;
    private final ChatRepository chatRepository;

    public static UserDto mapToDto(User user) {
        return UserDto.builder()
                .name(user.getName())
                .isCreator(user.isCreator())
                .separationId(user.getSeparationId())
                .build();
    }
    public void sendWebsocketMessage(String joinCode, LobbyMessage message) {
        simpMessagingTemplate.convertAndSend(String.format("/broker/%s",joinCode),message);
    }
    /**
     * Method that deletes a user from a lobby and the users messages
     * if user was the only one in the lobby it will also delete the lobby
     * @param user User to get deleted
     */
    public void deleteUser(User user) {
        Lobby lobby = user.getLobby();
        lobby.getUsers().remove(user);
        //delete all the messages from the user
        lobby.getMessages().removeAll(user.getMessages());
        chatRepository.deleteByUser(user);
        //if lobby becomes empty after user gets deleted, delete lobby too
        if (lobby.getUsers().size() > 0) {
            //if the user that's being deleted it the creator, make the next user in line the creator
            if (user.isCreator()) {
                User newCreator = lobby.getUsers().get(0);
                newCreator.setCreator(true);
                userRepository.save(newCreator);
                sendWebsocketMessage(lobby.getJoinCode(),new UserPromotedToCreator(mapToDto(newCreator)));
            }
            lobbyRepository.save(lobby);
        } else {
            lobbyRepository.delete(lobby);
        }
        userRepository.delete(user);

    }
    HashMap<UUID, Timer> userDisconnectTimers;
    /**
     * Called when a user gets disconnected and gives the user a 60 second grace period to join back
     * @param userId User that got disconnected
     */
    public void userDisconnected(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
                deleteUser(user);
                sendWebsocketMessage(user.getLobby().getJoinCode(),new UserKickedMessage(UserService.mapToDto(user)));
            }
        },1000 * 60);
        userDisconnectTimers.put(userId,timer);
        sendWebsocketMessage(user.getLobby().getJoinCode(),new UserDisconnectedMessage(UserService.mapToDto(user)));
    }
    /**
     * Called when a user gets reconnected
     * @param user User that got reconnected
     */
    public void userReconnected(User user) {
        userDisconnectTimers.getOrDefault(user.getId(),new Timer()).cancel();
        userDisconnectTimers.remove(user.getId());
        sendWebsocketMessage(user.getLobby().getJoinCode(),new UserReconnectedMessage(UserService.mapToDto(user)));
    }
}
