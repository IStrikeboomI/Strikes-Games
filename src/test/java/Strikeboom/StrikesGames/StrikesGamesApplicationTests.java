package Strikeboom.StrikesGames;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@ExtendWith(SpringExtension.class)
@TestPropertySource("classpath:application-test.properties")
@SpringBootTest
class StrikesGamesApplicationTests {

	@Autowired
	LobbyRepository lobbyRepository;
	@Autowired
	UserRepository userRepository;
	@Test
	@Transactional
	void deleteAllRepositoriesMade7DaysAgo() {
		List<Lobby> expiredLobbies = lobbyRepository.findLobbiesMadeSince(Instant.now().minus(7, ChronoUnit.DAYS));
		lobbyRepository.deleteAll(expiredLobbies);
	}

}
