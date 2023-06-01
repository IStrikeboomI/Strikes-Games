package Strikeboom.StrikesGames.websocket.message.game.tictactoe;

import Strikeboom.StrikesGames.game.Game;
import Strikeboom.StrikesGames.game.Player;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

public class MakeMoveMessage extends GameMessageHandler<TicTacToe> {
    public MakeMoveMessage(Object data) {
        super(Game.TIC_TAC_TOE.getName(), "makeMove", data);
    }

    @Override
    public boolean handle(TicTacToe game, Player player) {
        return true;
    }

    @Override
    public boolean canDispatch(TicTacToe game, Player player) {
        return true;
    }

    @Override
    public GameMessage dispatch(TicTacToe game, Player player) {
        return this;
    }
}
