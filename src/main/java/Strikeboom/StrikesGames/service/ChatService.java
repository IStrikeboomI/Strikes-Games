package Strikeboom.StrikesGames.service;

import Strikeboom.StrikesGames.dto.ChatMessageDto;
import Strikeboom.StrikesGames.entity.ChatMessage;
import Strikeboom.StrikesGames.repository.ChatRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ChatService {
    private final ChatRepository chatRepository;
    public static ChatMessageDto mapToDto(ChatMessage chatMessage) {
        return ChatMessageDto.builder()
                .text(chatMessage.getText())
                .separationId(chatMessage.getUser().getSeparationId())
                .created(chatMessage.getCreated())
                .build();
    }

    /**
     * Adds message to lobby and saves it to both lobby and user
     * @param message chat message entity
     */
    public void addMessage(ChatMessage message) {
        message.getLobby().getMessages().add(message);
        message.getUser().getMessages().add(message);
        chatRepository.save(message);
    }
}
