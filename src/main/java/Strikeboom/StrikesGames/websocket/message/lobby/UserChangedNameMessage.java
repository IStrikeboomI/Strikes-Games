package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserChangedNameMessage extends LobbyMessage{
    UUID separationId;
    String name;
    public UserChangedNameMessage(UUID separationId, String name) {
        super("userChangedName");
        this.separationId = separationId;
        this.name = name;
    }
}
