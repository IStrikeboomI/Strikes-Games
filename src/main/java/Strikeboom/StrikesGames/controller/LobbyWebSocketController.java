package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.service.LobbyService;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.InvocationTargetException;
import java.util.UUID;

/**
 * Controller that handles websocket messages for interactions within a lobby
 */
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
    public void start(SimpMessageHeaderAccessor headerAccessor) throws InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException {
        lobbyService.start(getIdFromHeaders(headerAccessor));
    }
    //Used for receiving game messages from clients
    @MessageMapping("/game")
    public void game(@RequestBody GameMessage message, SimpMessageHeaderAccessor headerAccessor) {
        lobbyService.receiveGameMessage(getIdFromHeaders(headerAccessor),message);
    }
    //Gets the UUID from the user that sent the message
    private static UUID getIdFromHeaders(SimpMessageHeaderAccessor headerAccessor) {
        return UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());
    }
}
