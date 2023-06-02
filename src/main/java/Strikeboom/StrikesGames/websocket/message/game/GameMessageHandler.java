package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.Game;

public abstract class GameMessageHandler<T extends Game> extends GameMessage{
    public GameMessageHandler(String game, String messageName, Object data) {
        super(game, messageName, data);
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
    public abstract GameMessage dispatch(T game, User player);
}
