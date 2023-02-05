package Strikeboom.StrikesGames.repository;

import Strikeboom.StrikesGames.entity.Lobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LobbyRepository extends JpaRepository<Lobby, UUID> {

}
