package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserReconnectedMessage extends LobbyMessage{
    UserDto user;
    public UserReconnectedMessage(UserDto user) {
        super("userReconnected");
        this.user = user;
    }
}
