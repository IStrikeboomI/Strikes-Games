package Strikeboom.StrikesGames;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.Game;
import Strikeboom.StrikesGames.game.GameInstance;
import Strikeboom.StrikesGames.repository.LobbyRepository;
import Strikeboom.StrikesGames.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.InvocationTargetException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

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
	@Test
	void createGameInstanceTest() throws InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException {
		String game = Game.TIC_TAC_TOE.getName();
		Lobby lobby = new Lobby(10000,"test lobby",game,false,2,Instant.now(),"lolloll",List.of(),true,List.of());
		User user1 = new User(UUID.randomUUID(),UUID.randomUUID(),"User 1",lobby,true,List.of());
		User user2 = new User(UUID.randomUUID(),UUID.randomUUID(),"User 2",lobby,false,List.of());
		lobby.setUsers(List.of(user1,user2));
		GameInstance instance = GameInstance.newInstance(lobby);
		System.out.println(instance);
	}

}
