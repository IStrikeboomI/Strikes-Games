package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;

import java.util.UUID;

@Data
public class UserDisconnectedMessage extends LobbyMessage{
    UUID separationId;
    public UserDisconnectedMessage(UUID separationId) {
        super("userDisconnected");
        this.separationId = separationId;
    }
}
