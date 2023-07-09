package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GameRestartedMessage extends LobbyMessage {
    public GameRestartedMessage() {
        super("gameRestarted");
    }
}
