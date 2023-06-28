package Strikeboom.StrikesGames.websocket.message.lobby;

import Strikeboom.StrikesGames.dto.ChatMessageDto;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UserSentMessageMessage extends LobbyMessage{
    ChatMessageDto chatMessage;
    public UserSentMessageMessage(ChatMessageDto chatMessage) {
        super("userSentMessage");
        this.chatMessage = chatMessage;
    }
}
