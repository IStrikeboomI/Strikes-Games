package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.game.GameInstance;
import Strikeboom.StrikesGames.game.Player;

public abstract class GameMessageHandler<T extends GameInstance> extends GameMessage{
    public abstract void handle(T game, Player player);
}
