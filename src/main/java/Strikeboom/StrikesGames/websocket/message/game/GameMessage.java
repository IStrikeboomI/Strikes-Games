package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.websocket.message.lobby.LobbyMessage;
import lombok.Data;

@Data
public class GameMessage extends LobbyMessage {
    String game;
    final String gameMessageName;
    Object data;

    public GameMessage(String game,String gameMessageName,Object data) {
        super("gameMessage");
        this.gameMessageName = gameMessageName;
        this.game = game;
        this.data = data;
    }
}
