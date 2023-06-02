package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.game.TurnBasedGame;

public class TicTacToe extends TurnBasedGame {
    public TicTacToe(Lobby lobby) {
        super(lobby);
    }

    @Override
    public GameInfo getGameInfo() {
        return Games.TIC_TAC_TOE;
    }
}
