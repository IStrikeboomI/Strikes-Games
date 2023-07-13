package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import Strikeboom.StrikesGames.websocket.message.game.tictactoe.MakeMoveMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Games {
    public static final List<GameInfo> GAMES = new ArrayList<>();

    public static final GameInfo SETH_HEAD = addToList(GameInfo.builder()
            .gameInstanceClass(SethHead.class)
            .name("Seth-Head")
            .minPlayers(2)
            .maxPlayers(4)
            .messages(Map.of())
            .build());
    public static final GameInfo TIC_TAC_TOE = addToList(GameInfo.builder()
             .gameInstanceClass(TicTacToe.class)
             .name("Tic-Tac-Toe")
             .minPlayers(2)
             .maxPlayers(2)
            .messages(Map.of("makeMove",MakeMoveMessage.class))
            .build());

    private static GameInfo addToList(GameInfo gameInfo) {
        GAMES.add(gameInfo);
        return gameInfo;
    }

    /**
     * Gets game info from the name of game
     * @param game name of game
     * @return game info, returns null if game name is not found
     */
    public static GameInfo getGame(String game) {
        for (GameInfo gameInfo : GAMES) {
            if (gameInfo.name().equalsIgnoreCase(game)) {
                return gameInfo;
            }
        }
        return null;
    }
}
