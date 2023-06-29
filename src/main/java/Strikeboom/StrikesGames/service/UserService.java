package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.UserDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.UserNotFoundException;
import Strikeboom.StrikesGames.repository.ChatRepository;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.websocket.message.lobby.*;
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
                sendWebsocketMessage(lobby,new UserPromotedToCreator(newCreator.getSeparationId()));
            }
        } else {
            lobbyRepository.delete(lobby);
        }
        userRepository.delete(user);

    }
    //Stores the uuid of users and timers for user that have disconnect and need to join back
    HashMap<UUID, Timer> userDisconnectTimers;
    /**
     * Called when a user gets disconnected and gives the user a 60 second grace period to join back
     * @param userId User that got disconnected
     */
    public void userDisconnected(UUID userId) {
        userRepository.findById(userId).ifPresent(user -> {
            Timer timer = new Timer();
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
                    sendWebsocketMessage(user.getLobby(),new UserKickedMessage(user.getSeparationId()));
                    deleteUser(user);
                }
            },1000 * 60);
            userDisconnectTimers.put(userId,timer);
            sendWebsocketMessage(user.getLobby(),new UserDisconnectedMessage(user.getSeparationId()));
        });
    }
    /**
     * Called when a user gets reconnected
     * @param user User that got reconnected
     */
    public void userReconnected(User user) {
        userDisconnectTimers.getOrDefault(user.getId(),new Timer()).cancel();
        userDisconnectTimers.remove(user.getId());
        sendWebsocketMessage(user.getLobby(),new UserReconnectedMessage(user.getSeparationId()));
    }
}
