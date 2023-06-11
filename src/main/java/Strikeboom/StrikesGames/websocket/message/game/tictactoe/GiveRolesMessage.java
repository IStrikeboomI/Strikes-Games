package Strikeboom.StrikesGames.websocket.message.game.tictactoe;

import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;

public class GiveRolesMessage extends GameMessage {
    public GiveRolesMessage(Object data) {
        super(Games.TIC_TAC_TOE.name(), "giveRoles", data);
    }
}
