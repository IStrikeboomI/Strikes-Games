package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
public class UserReconnectedMessage extends LobbyMessage{
    UUID separationId;
    public UserReconnectedMessage(UUID separationId) {
        super("userReconnected");
        this.separationId = separationId;
    }
}
