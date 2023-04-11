package Strikeboom.StrikesGames.websocket;

import Strikeboom.StrikesGames.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketDisconnectHandler {
    //used to detect when a client disconnects
    @Autowired
    UserService userService;
    @EventListener
    private void handleDisconnect(SessionDisconnectEvent event) {
        ConcurrentHashMap<String,String> attributes = (ConcurrentHashMap<String, String>) event.getMessage().getHeaders().get("simpSessionAttributes");
        UUID userId = UUID.fromString(attributes.get("userId"));
        userService.userDisconnected(userId);
    }
}
