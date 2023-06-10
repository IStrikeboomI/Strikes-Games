package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.game.TurnBasedGame;

import java.util.Random;

public class TicTacToe extends TurnBasedGame {
    User playerWithX;
    User playerWithO;
    public TicTacToe(Lobby lobby) {
        super(lobby);
        int randomUser = new Random().nextInt(2);
        playerWithX = lobby.getUsers().get(randomUser);
        playerWithO = lobby.getUsers().get(lobby.getUsers().size() - randomUser);
    }

    @Override
    public GameInfo getGameInfo() {
        return Games.TIC_TAC_TOE;
    }
}
