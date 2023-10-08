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
                //if card is valid then play
                //if card is either same suit or value
                if (card.suit.equals(game.pile.getLastCard().suit) || card.value.equals(game.pile.getLastCard().value)
                        //or if card is wild (jack or joker)
                    || card.value.equals(Card.Value.JACK) || card.value.equals(Card.Value.JOKER)) {
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
                    //change suit
                    if (card.value.equals(Card.Value.JACK) || card.value.equals(Card.Value.JOKER)) {

                    }
                    return true;
                }
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
                User cycledTo = game.cycleTurn();
                //if joker then give next person 4 cards
                if (card.value.equals(Card.Value.JOKER)) {
                    for (int i = 0;i < 4;i++) {
                        game.addCard(game.draw(),cycledTo);
                    }
                }
                //if king then give next person 2 cards
                if (card.value.equals(Card.Value.KING)) {
                    for (int i = 0;i < 2;i++) {
                        game.addCard(game.draw(),cycledTo);
                    }
                }
            }
        }
        game.checkForGameEnd();
    }
}
