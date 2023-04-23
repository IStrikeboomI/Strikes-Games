package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.ChatMessageDto;
import Strikeboom.StrikesGames.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ChatService {
    public static ChatMessageDto mapToDto(ChatMessage chatMessage) {
        return ChatMessageDto.builder()
                .text(chatMessage.getText())
                .user(UserService.mapToDto(chatMessage.getUser()))
                .build();
    }
}
