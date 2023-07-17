package Strikeboom.StrikesGames.game;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RangedIntegerSetting extends GameSetting{
    int min, max;
    public RangedIntegerSetting(String key, String name, Object value, int min, int max) {
        super(key, name, value,Type.INTEGER);
        this.min = min;
        this.max = max;
    }
}
