package Strikeboom.StrikesGames.websocket.message.lobby;

import java.util.UUID;

public class UserChangedNameMessage extends LobbyMessage{
    UUID separationId;
    String name;
    public UserChangedNameMessage(UUID separationId, String name) {
        super("userChangedName");
        this.separationId = separationId;
        this.name = name;
    }
}
