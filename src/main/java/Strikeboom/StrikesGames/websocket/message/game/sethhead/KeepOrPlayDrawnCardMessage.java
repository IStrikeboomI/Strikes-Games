package Strikeboom.StrikesGames.websocket.message.game.sethhead;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

import java.util.Map;

public class KeepOrPlayDrawnCardMessage extends GameMessageHandler<SethHead> {
    public KeepOrPlayDrawnCardMessage(String messageName, Map<String, Object> data) {
        super(messageName, data);
    }

    @Override
    public boolean handle(SethHead game, User player) {
        if (game.playerOnTurn.equals(player)) {
            if (getData().containsKey("choice")) {
                String choice = (String) getData().get("choice");
                if (choice.equals("keep")) {
                    game.addCard(game.drawnCard, player);
                    game.drawnCard = null;
                    return true;
                }
                if (choice.equals("play")) {
                    game.pile.addCard(game.drawnCard);
                    game.currentSuit = game.drawnCard.suit;
                    game.drawnCard = null;
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public ClientBoundGameMessage dispatch(SethHead game, User player) {
        return new ClientBoundGameMessage(messageName, Map.of("choice",getData()));
    }
}
