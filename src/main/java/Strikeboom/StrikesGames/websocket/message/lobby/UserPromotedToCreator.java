package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;

import java.util.UUID;

@Data
public class UserPromotedToCreator extends LobbyMessage {
    UUID separationId;

    public UserPromotedToCreator(UUID separationId) {
        super("userPromotedToCreator");
        this.separationId = separationId;
    }
}
