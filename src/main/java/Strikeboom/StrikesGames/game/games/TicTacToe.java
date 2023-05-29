package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.game.Game;
import Strikeboom.StrikesGames.game.TurnBasedGame;

public class TicTacToe extends TurnBasedGame {
    public TicTacToe(Lobby lobby) {
        super(Game.TIC_TAC_TOE,lobby);
    }
}
