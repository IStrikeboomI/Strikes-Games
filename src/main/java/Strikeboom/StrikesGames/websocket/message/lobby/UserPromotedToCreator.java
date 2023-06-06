package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.UserDto;
import lombok.Data;

@Data
public class UserPromotedToCreator extends LobbyMessage {
    UserDto user;

    public UserPromotedToCreator(UserDto user) {
        super("userPromotedToCreator");
        this.user = user;
    }
}
