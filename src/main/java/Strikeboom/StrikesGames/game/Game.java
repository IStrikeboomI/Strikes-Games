package Strikeboom.StrikesGames.game;

import lombok.Getter;

@Getter
public abstract class Game {
    private final String name;
    private final int minPlayers;
    private final int maxPlayers;
    public Game(String name, int minPlayers, int maxPlayers) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
    }
}
