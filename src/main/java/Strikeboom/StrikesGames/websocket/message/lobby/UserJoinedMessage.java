package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;

public class UserJoinedMessage extends LobbyMessage{
    UserDto user;

    public UserJoinedMessage(UserDto user) {
        super("userJoined");
        this.user = user;
    }
}
