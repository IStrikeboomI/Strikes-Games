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
        lobbyService.changeName(name,getIdFromHeaders(headerAccessor));
    }
    @MessageMapping("/kick-user")
    public void kickUser(@org.hibernate.validator.constraints.UUID String playerGettingKickedId, SimpMessageHeaderAccessor headerAccessor) {
        lobbyService.kickUser(UUID.fromString(playerGettingKickedId),getIdFromHeaders(headerAccessor));
    }
    @MessageMapping("/send-message")
    public void sendMessage(@RequestBody String message, SimpMessageHeaderAccessor headerAccessor) {
        lobbyService.sendMessage(message,getIdFromHeaders(headerAccessor));
    }
    @MessageMapping("/start")
    public void start(SimpMessageHeaderAccessor headerAccessor) {
        lobbyService.start(getIdFromHeaders(headerAccessor));
    }
    //Gets the UUID from the user that sent the message
    private static UUID getIdFromHeaders(SimpMessageHeaderAccessor headerAccessor) {
        return UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());
    }
}
