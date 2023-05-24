package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class GameStartedMessage extends LobbyMessage {
    public GameStartedMessage() {
        super("gameStarted");
    }
}
