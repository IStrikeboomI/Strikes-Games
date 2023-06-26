package Strikeboom.StrikesGames.websocket.message.game;

import Strikeboom.StrikesGames.websocket.message.lobby.LobbyMessage;
import lombok.Data;

import java.util.Map;

@Data
public class ClientBoundGameMessage extends LobbyMessage {
    String gameMessageName;
    Map<String, Object> data;

    public ClientBoundGameMessage(String gameMessageName,Map<String,Object> data) {
        super("gameMessage");
        this.gameMessageName = gameMessageName;
        this.data = data;
    }
}
