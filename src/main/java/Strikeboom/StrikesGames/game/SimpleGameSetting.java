package Strikeboom.StrikesGames.game;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * POJO used to store just key and value for game setting <br>
 * {@link GameSetting} is used to store additional info like name and type of setting
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SimpleGameSetting {
    String key;
    Object value;
}
