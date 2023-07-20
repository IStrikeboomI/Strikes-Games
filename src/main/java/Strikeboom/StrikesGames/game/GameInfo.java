package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.exception.GameNotFoundException;
import Strikeboom.StrikesGames.game.games.SethHead;
import Strikeboom.StrikesGames.game.games.TicTacToe;
import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import Strikeboom.StrikesGames.websocket.message.game.tictactoe.MakeMoveMessage;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;
import java.util.Set;

@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum GameInfo {
    SETH_HEAD(SethHead.class,"Seth-Head",2,4,Map.of(),Set.of(new RangedIntegerSetting("playerTimer","Player Timer",30,15,60),new GameSetting("test","Test",false, GameSetting.Type.BOOLEAN))),
    TIC_TAC_TOE(TicTacToe.class,"Tic-Tac-Toe",2,2,Map.of("makeMove", MakeMoveMessage.class),Set.of(new RangedIntegerSetting("playerTimer","Player Timer",30,15,60)));

    public static GameInfo getGame(String name) {
        for (GameInfo g : values()) {
            if (g.name.equals(name)) {
                return g;
            }
        }
        throw new GameNotFoundException(String.format("Game %s Not Found!",name));
    }

    @JsonIgnore
    final Class<? extends Game> gameInstanceClass;
    final String name;
    final int minPlayers;
    final int maxPlayers;
    @JsonIgnore
    final Map<String,Class<? extends GameMessageHandler<?>>> messages;
    final Set<GameSetting> defaultSettings;
}
