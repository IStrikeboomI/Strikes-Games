package Strikeboom.StrikesGames.game;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class GameSetting extends SimpleGameSetting{
    String name;
    Type type;

    public GameSetting(String key, String name, Object value, Type type) {
        super(key, value);
        this.name = name;
        this.type = type;
    }

    public enum Type {
        BOOLEAN,
        INTEGER
    }
}
