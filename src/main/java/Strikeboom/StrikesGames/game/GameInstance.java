package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.exception.GameNotFoundException;
import Strikeboom.StrikesGames.exception.TooManyPlayersException;
import lombok.Getter;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Getter
public abstract class GameInstance {
    private final Game game;
    private List<Player> players;
    public GameInstance(Game game) {
        this.game = game;
        this.players = new ArrayList<>();
    }
    public static GameInstance newInstance(Lobby lobby) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        Game g = Stream.of(Game.values()).filter(game1 -> game1.name().equals(lobby.getGame())).findFirst()
                .orElseThrow(() -> new GameNotFoundException(String.format("Game %s not found!",lobby.getGame())));
        return g.getGameInstanceClass().getConstructor(Game.class).newInstance(g);
    }
    public void addPlayer(Player player) {
        if (players.size() < game.getMaxPlayers()) {
            players.add(player);
        } else {
            throw new TooManyPlayersException("Too many players in game!");
        }
    }
}
