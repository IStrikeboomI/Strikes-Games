package Strikeboom.StrikesGames.websocket.message.game.tictactoe;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

import java.util.Map;

public class MakeMoveMessage extends GameMessageHandler<TicTacToe> {
    public MakeMoveMessage(String messageName, Map<String, Object> data) {
        super(messageName, data);
    }

    @Override
    public boolean handle(TicTacToe game, User player) {
        if (canDispatch(game,player)) {
            if (getData().containsKey("gridX") && getData().containsKey("gridY")) {
                int gridX = (int) getData().get("gridX");
                int gridY = (int) getData().get("gridY");
                if (game.grid[gridX][gridY] == ' ') {
                    game.grid[gridX][gridY] = game.getTurnFromPlayerOnTurn();
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public boolean canDispatch(TicTacToe game, User player) {
        return game.playerOnTurn.equals(player);
    }

    @Override
    public ClientBoundGameMessage dispatch(TicTacToe game, User player) {
        return new ClientBoundGameMessage(messageName,getData());
    }

    @Override
    public void postHandle(TicTacToe game, User player) {
        game.cycleTurn();
    }
}
