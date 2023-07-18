package Strikeboom.StrikesGames.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GameSetting {
    String key;
    String name;
    Object defaultValue;
    Type type;
    public enum Type {
        BOOLEAN,
        INTEGER
    }
}
