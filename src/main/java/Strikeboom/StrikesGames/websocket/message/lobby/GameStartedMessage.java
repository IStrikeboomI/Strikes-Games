package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Data;

@Data
public class GameStartedMessage extends LobbyMessage {
    public GameStartedMessage() {
        super("gameStarted");
    }
}
