package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.service.LobbyService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@AllArgsConstructor
public class LobbyWebSocketController {
    LobbyService lobbyService;
    @MessageMapping("/change-name")
    public void changeName(@RequestBody String name, SimpMessageHeaderAccessor headerAccessor) {
        UUID userId = UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());
        lobbyService.changeName(name,userId);
    }
    @MessageMapping("/kick-user")
    public void kickUser(@org.hibernate.validator.constraints.UUID String playerGettingKickedId, SimpMessageHeaderAccessor headerAccessor) {
        UUID userId = UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());
        lobbyService.kickUser(UUID.fromString(playerGettingKickedId),userId);
    }
    @MessageMapping("/send-message")
    public void sendMessage(@RequestBody String message, SimpMessageHeaderAccessor headerAccessor) {
        UUID userId = UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());

    }
}
