package Strikeboom.StrikesGames;

import Strikeboom.StrikesGames.repository.LobbyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@ExtendWith(SpringExtension.class)
@TestPropertySource("classpath:application-test.properties")
@SpringBootTest
class StrikesGamesApplicationTests {

	@Autowired
	LobbyRepository lobbyRepository;
	@Test
	@Transactional
	void getAllRepositoriesMade7DaysAgo() {
		System.out.println(lobbyRepository.findLobbiesMadeSince(
				Instant.now().minus(7, ChronoUnit.DAYS))
		);
	}

}
