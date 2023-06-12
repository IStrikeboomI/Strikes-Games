package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.websocket.message.lobby.LobbyMessage;
import lombok.Data;

import java.util.Map;

@Data
public class GameMessage extends LobbyMessage {
    String game;
    final String gameMessageName;
    Map<String,Object> data;

    public GameMessage(String game,String gameMessageName,Map<String,Object> data) {
        super("gameMessage");
        this.gameMessageName = gameMessageName;
        this.game = game;
        this.data = data;
    }
}
