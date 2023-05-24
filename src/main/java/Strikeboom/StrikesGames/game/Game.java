package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.exception.GameNotFoundException;
import Strikeboom.StrikesGames.exception.TooManyPlayersException;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public abstract class Game {
    private final String name;
    private final int minPlayers;
    private final int maxPlayers;
    private List<Player> players;
    public Game(String name, int minPlayers, int maxPlayers) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.players = new ArrayList<>();
    }
    public static Game newInstance(Lobby lobby) {
        return Games.GAMES.stream().filter(game -> game.getName().equals(lobby.getGame())).findFirst()
                .orElseThrow(() -> new GameNotFoundException(String.format("Game %s Not found!",lobby.getGame())));
    }
    public void addPlayer(Player player) {
        if (players.size() < maxPlayers) {
            players.add(player);
        } else {
            throw new TooManyPlayersException("Too many players in game!");
        }
    }
}
