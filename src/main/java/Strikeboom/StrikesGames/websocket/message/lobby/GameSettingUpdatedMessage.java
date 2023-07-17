package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GameSettingUpdatedMessage extends LobbyMessage {
    String key;
    Object value;
    public GameSettingUpdatedMessage(String key, Object value) {
        super("gameSettingUpdated");
        this.key = key;
        this.value = value;
    }
}
