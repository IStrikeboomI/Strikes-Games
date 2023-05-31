package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.game.GameInstance;
import Strikeboom.StrikesGames.game.Player;

public abstract class GameMessageHandler<T extends GameInstance> extends GameMessage{
    public GameMessageHandler(String game, String messageName, Object data) {
        super(game, messageName, data);
    }
    /**
     * Checks if message data is valid in context to game <br>
     * Ex. a player can't make a tic-tac-toe move inside a square that already has something marked
     * @param game Instance of game
     * @param player Player that sent message
     * @return whether message can be handled
     */
    public abstract boolean canHandle(T game, Player player);
    /**
     * Handles the message received
     * @param game Instance of game
     * @param player Player that sent message
     */
    public abstract void handle(T game, Player player);

    /**
     * Determines if the message should be sent out to the clients <br>
     * Can only dispatch out if the message can be received
     * @param game Instance of game
     * @param player Player that sent message
     * @return whether message can be sent
     */
    public abstract boolean canDispatch(T game, Player player);

    /**
     * Game message to be sent to all the clients <br>
     * Does not actually sent, just prepares the message
     * @param game Instance of game
     * @param player Player that sent message
     * @return Game message to be sent out
     */
    public abstract GameMessage dispatch(T game, Player player);
}