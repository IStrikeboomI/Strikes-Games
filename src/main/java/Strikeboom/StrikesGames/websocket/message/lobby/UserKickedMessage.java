package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;

import java.util.UUID;

@Data
public class UserKickedMessage extends LobbyMessage{
    UUID separationId;
    public UserKickedMessage(UUID separationId) {
        super("userKicked");
        this.separationId = separationId;
    }
}
