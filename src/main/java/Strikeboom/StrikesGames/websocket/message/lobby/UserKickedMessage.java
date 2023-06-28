package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
public class UserKickedMessage extends LobbyMessage{
    UUID separationId;
    public UserKickedMessage(UUID separationId) {
        super("userKicked");
        this.separationId = separationId;
    }
}
