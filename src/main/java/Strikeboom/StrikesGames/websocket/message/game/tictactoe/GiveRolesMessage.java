package Strikeboom.StrikesGames.websocket.message.game.tictactoe;

import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;

import java.util.Map;
import java.util.UUID;

public class GiveRolesMessage extends GameMessage {
    public GiveRolesMessage(UUID separationId, String role) {
        super(Games.TIC_TAC_TOE.name(), "giveRoles", Map.of("separationId",separationId,"role",role));
    }
}
