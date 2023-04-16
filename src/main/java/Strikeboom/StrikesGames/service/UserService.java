package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.UserDto;
import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.UserNotFoundException;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.websocket.message.UserDisconnectedMessage;
import Strikeboom.StrikesGames.websocket.message.UserReconnectedMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final UserRepository userRepository;
    private final LobbyRepository lobbyRepository;

    private final LobbyService lobbyService;
    public static UserDto mapToDto(User user) {
        return UserDto.builder()
                .name(user.getName())
                .isCreator(user.isCreator())
                .separationId(user.getSeparationId())
                .build();
    }
    public void deleteUser(User user) {
        Lobby lobby = user.getLobby();
        lobby.getUsers().remove(user);
        lobbyRepository.save(lobby);
        userRepository.delete(user);
    }
    HashMap<UUID, Timer> userDisconnectTimers = new HashMap<>();
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
                System.out.println("user disconnect: " + userId);
            }
        },1000 * 3);
        userDisconnectTimers.put(user.getId(),timer);
        lobbyService.sendWebsocketMessage(user.getLobby().getJoinCode(),new UserDisconnectedMessage(UserService.mapToDto(user)));
    }
    /**
     * Called when a user gets reconnected
     * @param user User that got reconnected
     */
    public void userReconnected(User user) {
        reconnectUser(user);
        userDisconnectTimers.get(user.getId()).cancel();
        userDisconnectTimers.remove(user.getId());
        lobbyService.sendWebsocketMessage(user.getLobby().getJoinCode(),new UserReconnectedMessage(UserService.mapToDto(user)));
    }
    public void disconnectUser(User user) {
        user.setDisconnected(true);
        userRepository.save(user);
    }
    public void reconnectUser(User user) {
        user.setDisconnected(false);
        userRepository.save(user);
    }
}
