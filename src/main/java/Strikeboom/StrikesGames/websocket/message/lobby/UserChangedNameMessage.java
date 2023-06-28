package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
public class UserChangedNameMessage extends LobbyMessage{
    UUID separationId;
    String name;
    public UserChangedNameMessage(UUID separationId, String name) {
        super("userChangedName");
        this.separationId = separationId;
        this.name = name;
    }
}
