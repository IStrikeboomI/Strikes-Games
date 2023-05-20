package Strikeboom.StrikesGames.repository;

import Strikeboom.StrikesGames.entity.Lobby;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface LobbyRepository extends JpaRepository<Lobby, Long> {
    @Query("SELECT l FROM Lobby l WHERE joinCode=?1")
    Optional<Lobby> findLobbyFromJoinCode(String joinCode);

    @Query("SELECT l FROM Lobby l WHERE isPrivate=false AND size(l.users)<maxPlayers AND gameStarted=false")
    List<Lobby> findNonFullPublicLobbies(Pageable p);

    /**
     * Finds lobbies made after a certain time
     * @param startDate Oldest a lobby can be
     * @return List of lobbies made after the startDate
     */
    @Query("SELECT l FROM Lobby l WHERE l.created <= :startDate")
    List<Lobby> findLobbiesMadeSince(@Param("startDate") Instant startDate);
}
