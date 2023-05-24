package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserKickedMessage extends LobbyMessage{
    UserDto user;
    public UserKickedMessage(UserDto user) {
        super("userKicked");
        this.user = user;
    }
}
