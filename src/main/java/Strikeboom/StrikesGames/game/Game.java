package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import Strikeboom.StrikesGames.websocket.message.game.tictactoe.MakeMoveMessage;
import lombok.Getter;

import java.util.List;

@Getter
public enum Game {
    SETH_HEAD(SethHead.class,"Seth-Head",2,4),
    TIC_TAC_TOE(TicTacToe.class,"Tic-Tac-Toe",2,2, MakeMoveMessage.class);

    private final Class<? extends GameInstance> gameInstanceClass;
    private final String name;
    private final int minPlayers;
    private final int maxPlayers;
    private final List<Class<? extends GameMessageHandler<?>>> messages;
    Game(Class<? extends GameInstance> gameInstanceClass, String name, int minPlayers, int maxPlayers, Class<? extends GameMessageHandler<?>>... messages) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.gameInstanceClass = gameInstanceClass;
        this.messages = List.of(messages);
    }
}
