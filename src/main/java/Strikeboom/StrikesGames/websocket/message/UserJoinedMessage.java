package Strikeboom.StrikesGames.websocket.message;

import Strikeboom.StrikesGames.dto.UserDto;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UserJoinedMessage extends LobbyMessage{
    UserDto user;

    public UserJoinedMessage() {
        super("userJoined");
    }
}
