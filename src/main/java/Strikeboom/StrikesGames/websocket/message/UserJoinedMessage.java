package Strikeboom.StrikesGames.websocket.message;

import Strikeboom.StrikesGames.dto.UserDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserJoinedMessage extends LobbyMessage{
    UserDto user;

    public UserJoinedMessage(UserDto user) {
        super("userJoined");
        this.user = user;
    }
}
