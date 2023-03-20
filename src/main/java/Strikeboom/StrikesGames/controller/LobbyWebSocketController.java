package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.UserNotFoundException;
import Strikeboom.StrikesGames.repository.UserRepository;
import Strikeboom.StrikesGames.websocket.message.UserChangedNameMessage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@AllArgsConstructor
@Transactional
public class LobbyWebSocketController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    UserRepository userRepository;
    @MessageMapping("/change-name")
    public void changeName(@RequestBody String name, SimpMessageHeaderAccessor headerAccessor) {
        UUID userId = UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(String.format("User With Id:%s Not Found!",userId)));
        Lobby lobby = user.getLobby();
        user.setName(name);
        userRepository.save(user);
        simpMessagingTemplate.convertAndSend(String.format("/broker/%s",lobby.getJoinCode()),new UserChangedNameMessage(user.getSeparationId(), name));
    }
}
