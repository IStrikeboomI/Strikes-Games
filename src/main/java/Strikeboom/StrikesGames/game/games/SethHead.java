package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.game.Game;
import Strikeboom.StrikesGames.game.TurnBasedGame;

public class SethHead extends TurnBasedGame {
    public SethHead(Lobby lobby) {
        super(Game.SETH_HEAD,lobby);
    }
}
