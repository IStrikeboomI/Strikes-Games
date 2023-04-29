package Strikeboom.StrikesGames.repository;

import Strikeboom.StrikesGames.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
}
