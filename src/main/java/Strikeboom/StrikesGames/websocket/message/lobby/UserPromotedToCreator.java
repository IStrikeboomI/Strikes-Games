package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
public class UserPromotedToCreator extends LobbyMessage {
    UUID separationId;

    public UserPromotedToCreator(UUID separationId) {
        super("userPromotedToCreator");
        this.separationId = separationId;
    }
}
