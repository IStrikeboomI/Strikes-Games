package Strikeboom.StrikesGames.game;

import lombok.Data;

import java.util.HashMap;

@Data
public class GameEndedData {
    public boolean gameEnded;
    public HashMap<String, Object> data = new HashMap<>();
}
