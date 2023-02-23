package Strikeboom.StrikesGames.repository;

import Strikeboom.StrikesGames.entity.Lobby;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LobbyRepository extends JpaRepository<Lobby, Long> {
    @Query("SELECT l FROM Lobby l WHERE joinCode=?1")
    Optional<Lobby> findLobbyFromJoinCode(String joinCode);

    @Query(value = "SELECT l from Lobby l WHERE isPrivate=false")
    List<Lobby> findPublicLobbies(Pageable p);
}
