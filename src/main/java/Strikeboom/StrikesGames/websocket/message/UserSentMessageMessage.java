package Strikeboom.StrikesGames.websocket.message;

import Strikeboom.StrikesGames.dto.ChatMessageDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserSentMessageMessage extends LobbyMessage{
    ChatMessageDto chatMessage;
    public UserSentMessageMessage(ChatMessageDto chatMessage) {
        super("userSentMessage");
        this.chatMessage = chatMessage;
    }
}
