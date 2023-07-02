package Strikeboom.StrikesGames.websocket;

import Strikeboom.StrikesGames.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.UUID;

@Component
public class WebSocketSubscribeHandler {
    @Autowired
    LobbyService lobbyService;
    @EventListener
    public void onSessionSubscribe(SessionSubscribeEvent event) {
        if (event.getUser() != null) {
            lobbyService.sendGameInitMessages(UUID.fromString(event.getUser().getName()));
        }
    }
}
