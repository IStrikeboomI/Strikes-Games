package Strikeboom.StrikesGames.websocket.message.game.sethhead;

import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;

import java.util.Map;

public class PlayDrawedCardMessage extends GameMessageHandler<SethHead> {
    public PlayDrawedCardMessage(String messageName, Map<String, Object> data) {
        super(messageName, data);
    }

    @Override
    public boolean handle(SethHead game, User player) {
        return false;
    }

    @Override
    public ClientBoundGameMessage dispatch(SethHead game, User player) {
        return new ClientBoundGameMessage(messageName, getData());
    }
}
