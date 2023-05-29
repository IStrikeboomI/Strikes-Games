package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Instance of a user in a game
 */
@Data
@AllArgsConstructor
public class Player {
    User user;
}
