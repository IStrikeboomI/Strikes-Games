package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.service.LobbyService;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;
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
    @MessageMapping("/update-setting")
    public void updateSetting(@RequestBody String key,@RequestBody Object value, SimpMessageHeaderAccessor headerAccessor) {
        lobbyService.updateSetting(key, value,getIdFromHeaders(headerAccessor));
    }
    @MessageMapping("/start")
    public void start(SimpMessageHeaderAccessor headerAccessor) throws InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException {
        lobbyService.start(getIdFromHeaders(headerAccessor));
    }
    @MessageMapping("/restart")
    public void restart(SimpMessageHeaderAccessor headerAccessor) {
        lobbyService.restart(getIdFromHeaders(headerAccessor));
    }
    //Used for receiving game messages from clients
    @MessageMapping("/game/{game}/{messageName}")
    public void game(@DestinationVariable String game, @DestinationVariable String messageName, @RequestBody Map<String,Object> message, SimpMessageHeaderAccessor headerAccessor) throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        lobbyService.receiveGameMessage(getIdFromHeaders(headerAccessor),game,messageName,new GameMessage(message));
    }
    //Gets the UUID from the user that sent the message
    private static UUID getIdFromHeaders(SimpMessageHeaderAccessor headerAccessor) {
        return UUID.fromString(headerAccessor.getSessionAttributes().get("userId").toString());
    }
}
