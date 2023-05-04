package Strikeboom.StrikesGames.repository;

import Strikeboom.StrikesGames.entity.ChatMessage;
import Strikeboom.StrikesGames.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    Long deleteByUser(User user);
}
