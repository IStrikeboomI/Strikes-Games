package Strikeboom.StrikesGames.repository;

import Strikeboom.StrikesGames.entity.Lobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LobbyRepository extends JpaRepository<Lobby, Long> {
    @Query("SELECT l FROM Lobby l WHERE joinCode=?1")
    Optional<Lobby> findLobbyFromJoinCode(String joinCode);
}
