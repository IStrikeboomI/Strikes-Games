package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.GameNotFoundException;
import Strikeboom.StrikesGames.exception.MessageNotFoundException;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import Strikeboom.StrikesGames.websocket.message.lobby.LobbyMessage;
import lombok.Getter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.Map;

@Getter
public abstract class Game {
    private final Lobby lobby;
    private final SimpMessagingTemplate simpMessagingTemplate;
    public Game(Lobby lobby, SimpMessagingTemplate simpMessagingTemplate) {
        this.lobby = lobby;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public abstract GameInfo getGameInfo();

    public static Game newInstance(Lobby lobby,SimpMessagingTemplate template) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        GameInfo g = Games.GAMES.stream().filter(game1 -> game1.name().equals(lobby.getGame())).findFirst()
                .orElseThrow(() -> new GameNotFoundException(String.format("Game %s not found!",lobby.getGame())));
        return g.gameInstanceClass().getConstructor(Lobby.class,SimpMessagingTemplate.class).newInstance(lobby,template);
    }

    /**
     * Gets message handler of game message <br>
     * @param message message
     * @return whether the message can be received
     */
    public GameMessageHandler<?> getMessageHandler(String messageName,GameMessage message) throws InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException {
        if (getGameInfo().messages().containsKey(messageName)) {
            System.out.println(Arrays.toString(getGameInfo().messages().get(messageName).getConstructors()));
            return getGameInfo().messages().get(messageName).getConstructor(String.class, Map.class).newInstance(messageName,message.getData());
        } else {
            throw new MessageNotFoundException(String.format("Message %s not found!",messageName));
        }
    }
    public void sendMessageToUsers(LobbyMessage message, User... users) {
        for (User u : users) {
            simpMessagingTemplate.convertAndSendToUser(u.getId().toString(),String.format("/broker/%s", lobby.getJoinCode()), message);
        }
    }
    public void sendMessageToAll(LobbyMessage message) {
        sendMessageToUsers(message,lobby.getUsers().toArray(new User[0]));
    }
}
