package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller that just has a json file with the games available
 */
@RestController
public class GamesController {
    @GetMapping(value = "/games.json",produces ="application/json")
    public List<GameInfo> games() {
        return Games.GAMES;
    }
}
