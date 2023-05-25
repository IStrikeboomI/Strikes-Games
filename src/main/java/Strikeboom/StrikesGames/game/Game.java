package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import lombok.Getter;

@Getter
public enum Game {
    SETH_HEAD(SethHead.class,"Seth-Head",2,4),
    TIC_TAC_TOE(TicTacToe.class,"Tic-Tac-Toe",2,2);

    private final Class<? extends GameInstance> gameInstanceClass;
    private final String name;
    private final int minPlayers;
    private final int maxPlayers;
    Game(Class<? extends GameInstance> gameInstanceClass,String name, int minPlayers, int maxPlayers) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.gameInstanceClass = gameInstanceClass;
    }
}
