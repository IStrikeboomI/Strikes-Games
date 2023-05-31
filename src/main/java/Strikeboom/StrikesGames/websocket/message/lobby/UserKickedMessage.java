package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;

public class UserKickedMessage extends LobbyMessage{
    UserDto user;
    public UserKickedMessage(UserDto user) {
        super("userKicked");
        this.user = user;
    }
}
