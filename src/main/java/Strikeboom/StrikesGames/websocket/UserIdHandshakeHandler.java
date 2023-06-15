package Strikeboom.StrikesGames.websocket;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.WebUtils;

import java.security.Principal;
import java.util.Map;
import java.util.Objects;

//In order to prevent message broadcasting (messages getting sent to all users), we need to give our users a name
//normally the username would be for a user that's authenticated with a login and all, but since we use the user id, we set that as the name
//this is vital to methods such as simpMessagingTemplate.convertAndSendToUser with the name as the user id to send to
public class UserIdHandshakeHandler extends DefaultHandshakeHandler {
    //Creates a principal where the name is the user id
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletServerRequest) {
            HttpServletRequest servletRequest = servletServerRequest.getServletRequest();
            Cookie userId = WebUtils.getCookie(servletRequest, "userId");
            return () -> Objects.requireNonNull(userId).getValue();
        }
        return null;
    }
}
