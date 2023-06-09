package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;

import java.util.UUID;

@Data
public class UserReconnectedMessage extends LobbyMessage{
    UUID separationId;
    public UserReconnectedMessage(UUID separationId) {
        super("userReconnected");
        this.separationId = separationId;
    }
}
