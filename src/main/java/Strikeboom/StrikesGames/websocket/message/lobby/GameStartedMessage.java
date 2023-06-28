package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GameStartedMessage extends LobbyMessage {
    public GameStartedMessage() {
        super("gameStarted");
    }
}
