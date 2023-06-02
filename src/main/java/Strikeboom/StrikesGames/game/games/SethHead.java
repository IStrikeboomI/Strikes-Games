package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.game.TurnBasedGame;

public class SethHead extends TurnBasedGame {
    public SethHead(Lobby lobby) {
        super(lobby);
    }

    @Override
    public GameInfo getGameInfo() {
        return Games.SETH_HEAD;
    }
}
