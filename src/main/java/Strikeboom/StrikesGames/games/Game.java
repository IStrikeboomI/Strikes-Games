package Strikeboom.StrikesGames.games;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Game {
    SETH_HEAD("Seth-Head",4),
    TIC_TAC_TOE("Tic-Tac-Toe",2);

    private String name;
    private int maxPlayers;
    Game(String name, int maxPlayers) {
        this.name = name;
        this.maxPlayers = maxPlayers;
    }
}
