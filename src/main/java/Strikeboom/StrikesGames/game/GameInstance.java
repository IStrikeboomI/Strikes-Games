package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
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
    private final Lobby lobby;
    private List<Player> players;
    public GameInstance(Game game, Lobby lobby) {
        this.game = game;
        this.lobby = lobby;
        this.players = new ArrayList<>();
        for (User user : lobby.getUsers()) {
            addPlayer(new Player(user));
        }
    }
    public static GameInstance newInstance(Lobby lobby) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        Game g = Stream.of(Game.values()).filter(game1 -> game1.getName().equals(lobby.getGame())).findFirst()
                .orElseThrow(() -> new GameNotFoundException(String.format("Game %s not found!",lobby.getGame())));
        return g.getGameInstanceClass().getConstructor(Lobby.class).newInstance(lobby);
    }
    public void addPlayer(Player player) {
        if (players.size() < game.getMaxPlayers()) {
            players.add(player);
        } else {
            throw new TooManyPlayersException("Too many players in game!");
        }
    }
}
