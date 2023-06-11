package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.exception.GameNotFoundException;
import Strikeboom.StrikesGames.exception.MessageNotFoundException;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import lombok.Getter;

import java.lang.reflect.InvocationTargetException;

@Getter
public abstract class Game {
    private final Lobby lobby;
    public Game(Lobby lobby) {
        this.lobby = lobby;
    }

    public abstract GameInfo getGameInfo();

    public static Game newInstance(Lobby lobby) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        GameInfo g = Games.GAMES.stream().filter(game1 -> game1.name().equals(lobby.getGame())).findFirst()
                .orElseThrow(() -> new GameNotFoundException(String.format("Game %s not found!",lobby.getGame())));
        return g.gameInstanceClass().getConstructor(Lobby.class).newInstance(lobby);
    }

    /**
     * Gets message handler of game message <br>
     * @param message message
     * @return whether the message can be received
     */
    public GameMessageHandler<?> getMessageHandler(GameMessage message) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        return getGameInfo().messages().stream().filter(aClass -> {
            try {
                return aClass.getDeclaredField("messageName").get("").equals(message.getGameMessageName());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }).findFirst().orElseThrow(() -> new MessageNotFoundException(String.format("Message %s not found!",message.getGameMessageName()))).getConstructor(Object.class).newInstance(message.getData());
    }
}
