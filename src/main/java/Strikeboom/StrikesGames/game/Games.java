package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.game.games.TicTacToe;

import java.util.ArrayList;
import java.util.List;

public class Games {
    public static final List<Game> GAMES = new ArrayList<>();

    static {
        GAMES.add(new SethHead());
        GAMES.add(new TicTacToe());
    }
}
