package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.Game;

import java.util.List;
import java.util.Map;

public abstract class GameMessageHandler<T extends Game> extends GameMessage{
    public final String messageName;

    public GameMessageHandler(String messageName,Map<String, Object> data) {
        super(data);
        this.messageName = messageName;
    }

    /**
     * Handles the message received
     * @param game Instance of game
     * @param player Player that sent message
     * @return Whether method could be handled or not, Checks if message data is valid in context to game <br>
     *      Ex. a player can't make a tic-tac-toe move inside a square that already has something marked
     */
    public abstract boolean handle(T game, User player);

    /**
     * Determines if the message should be sent out to all the clients <br>
     * Can only dispatch out if the message can be received
     * @param game Instance of game
     * @param player Player that sent message
     * @return whether message can be sent
     */
    public abstract boolean canDispatch(T game, User player);

    /**
     * GameInfo message to be sent to all the clients <br>
     * Does not actually sent, just prepares the message
     * @param game Instance of game
     * @param player Player that sent message
     * @return GameInfo message to be sent out
     */
    public abstract ClientBoundGameMessage dispatch(T game, User player);

    /**
     * Some messages only need to be sent to some people so a method to choose who to send to <br>
     * Defaults to sending to everyone
     * @param game Instance of game
     * @return Players to dispatch message to
     */
    public List<User> dispatchTo(T game) {
        return game.getLobby().getUsers();
    }
}
