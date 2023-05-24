package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserDisconnectedMessage extends LobbyMessage{
    UserDto user;
    public UserDisconnectedMessage(UserDto user) {
        super("userDisconnected");
        this.user = user;
    }
}
