package Strikeboom.StrikesGames.controller;

import Strikeboom.StrikesGames.games.Game;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller that just has a json file with the games available
 */
@RestController
public class GamesController {
    @GetMapping(value = "/games.json",produces ="application/json")
    public Game[] games() {
        return Game.values();
    }
}
