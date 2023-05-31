package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;

public class UserDisconnectedMessage extends LobbyMessage{
    UserDto user;
    public UserDisconnectedMessage(UserDto user) {
        super("userDisconnected");
        this.user = user;
    }
}
