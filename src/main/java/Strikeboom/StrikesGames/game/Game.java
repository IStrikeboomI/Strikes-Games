package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.exception.GameNotFoundException;
import Strikeboom.StrikesGames.exception.TooManyPlayersException;
import Strikeboom.StrikesGames.websocket.message.game.GameMessage;
import lombok.Getter;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

@Getter
public abstract class Game {
    private final Lobby lobby;
    private List<Player> players;
    public Game(Lobby lobby) {
        this.lobby = lobby;
        this.players = new ArrayList<>();
        for (User user : lobby.getUsers()) {
            addPlayer(new Player(user));
        }
    }

    public abstract GameInfo getGameInfo();

    public static Game newInstance(Lobby lobby) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        GameInfo g = Games.GAMES.stream().filter(game1 -> game1.getName().equals(lobby.getGame())).findFirst()
                .orElseThrow(() -> new GameNotFoundException(String.format("Game %s not found!",lobby.getGame())));
        return g.getGameInstanceClass().getConstructor(Lobby.class).newInstance(lobby);
    }

    /**
     * Checks if a message can be received by the user sending it, and then dispatches it <br>
     * Does not check for if a message's data is a valid move, that's for the message dispatcher to handle
     * @param user user sending the message
     * @param message message contents
     * @return whether or not the message can be received
     */
    public boolean canMessageBeReceived(User user, GameMessage message) {
        return true;
    }
    public void addPlayer(Player player) {
        if (players.size() < getGameInfo().getMaxPlayers()) {
            players.add(player);
        } else {
            throw new TooManyPlayersException("Too many players in game!");
        }
    }
}
