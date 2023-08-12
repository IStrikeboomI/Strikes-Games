package Strikeboom.StrikesGames.websocket.message.game.sethhead;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.card.Card;
import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

import java.util.Map;

public class MakeMoveMessage extends GameMessageHandler<SethHead> {
    public MakeMoveMessage(String messageName, Map<String, Object> data) {
        super(messageName, data);
    }

    @Override
    public boolean handle(SethHead game, User player) {
        if (canDispatch(game,player)) {
            if (getData().containsKey("card")) {
                Card card = Card.fromString((String) getData().get("card"));
                //if card that's played is in hand then take from hand
                if (game.hands.get(player).containsCard(card)) {
                    game.hands.get(player).removeCard(card);
                }
                //if card is from visible deck
                if (game.visibleCards.get(player).containsCard(card)) {
                    game.visibleCards.get(player).removeCard(card);
                    //if there are still cards in hand, you need to replace the visible card played from a card in your hand
                    if (game.hands.get(player).size() > 0) {
                        if (getData().containsKey("replacementCard")) {
                            Card replacementCard = Card.fromString((String) getData().get("replacementCard"));
                            game.hands.get(player).removeCard(replacementCard);
                            game.visibleCards.get(player).addCard(replacementCard);
                        } else {
                            return false;
                        }
                    }
                }
                game.pile.addCard(card);
                return true;
            }
        }
        return false;
    }

    @Override
    public ClientBoundGameMessage dispatch(SethHead game, User player) {
        return new ClientBoundGameMessage(messageName,getData());
    }

    @Override
    public void postHandle(SethHead game, User player) {
        super.postHandle(game, player);
        if (getData().containsKey("card")) {
            Card card = Card.fromString((String) getData().get("card"));
            //only cycle turn if card is not queen
            if (!card.value.equals(Card.Value.QUEEN)) {
                game.cycleTurn();
            }
        }
        game.checkForGameEnd();
    }
}
