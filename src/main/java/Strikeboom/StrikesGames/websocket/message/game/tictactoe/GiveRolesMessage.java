package Strikeboom.StrikesGames.websocket.message.game.tictactoe;

import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;

import java.util.Map;
import java.util.UUID;

public class GiveRolesMessage extends ClientBoundGameMessage {
    public GiveRolesMessage(UUID separationId, String role) {
        super("giveRoles", Map.of("separationId",separationId,"role",role));
    }
}
