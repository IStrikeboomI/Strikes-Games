package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
public class UserDisconnectedMessage extends LobbyMessage{
    UUID separationId;
    public UserDisconnectedMessage(UUID separationId) {
        super("userDisconnected");
        this.separationId = separationId;
    }
}
