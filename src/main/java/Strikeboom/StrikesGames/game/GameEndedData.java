package Strikeboom.StrikesGames.game;

import lombok.Data;

import java.util.HashMap;

/**
 * POJO used when checking and handling game end
 */
@Data
public class GameEndedData {
    /**
     * Determines if game is ended
     */
    public boolean gameEnded;
    /**
     * Additional data where values are added when checking for the game ended and are used when game is actually ended
     */
    public HashMap<String, Object> data = new HashMap<>();
}
