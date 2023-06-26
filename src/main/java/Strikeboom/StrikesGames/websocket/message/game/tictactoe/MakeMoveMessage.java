package Strikeboom.StrikesGames.websocket.message.game.tictactoe;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

import java.util.Map;

public class MakeMoveMessage extends GameMessageHandler<TicTacToe> {
    public MakeMoveMessage(Map<String,Object> data) {
        super("makeMove",data);
    }

    @Override
    public boolean handle(TicTacToe game, User player) {
        return true;
    }

    @Override
    public boolean canDispatch(TicTacToe game, User player) {
        return true;
    }

    @Override
    public ClientBoundGameMessage dispatch(TicTacToe game, User player) {
        return new ClientBoundGameMessage(messageName,getData());
    }
}
