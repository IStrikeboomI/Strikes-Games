package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.game.SimpleGameSetting;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class GameSettingUpdatedMessage extends LobbyMessage {
    SimpleGameSetting setting;
    public GameSettingUpdatedMessage(SimpleGameSetting setting) {
        super("gameSettingUpdated");
        this.setting = setting;
    }
}
