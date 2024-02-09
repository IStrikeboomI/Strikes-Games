package Strikeboom.StrikesGames.websocket.message.game.sethhead;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

import java.util.List;
import java.util.Map;

public class DrawCardMessage extends GameMessageHandler<SethHead> {
    public DrawCardMessage(String messageName, Map<String, Object> data) {
        super(messageName, data);
    }

    @Override
    public boolean handle(SethHead game, User player) {
        if (game.playerOnTurn.equals(player)) {
            game.drawnCard = game.draw();
            if (game.isCardValid(game.drawnCard)) {

            } else {
                game.addCard(game.drawnCard, player);
                game.cycleTurn();
                game.drawnCard = null;
            }
            return true;
        }
        return false;
    }

    @Override
    public ClientBoundGameMessage dispatch(SethHead game, User player) {
        return new ClientBoundGameMessage(messageName, Map.of("card",game.drawnCard));
    }

    @Override
    public List<User> dispatchTo(SethHead game) {
        if (game.drawnCard != null) {
            return List.of(game.playerOnTurn);
        }
        return super.dispatchTo(game);
    }

}
