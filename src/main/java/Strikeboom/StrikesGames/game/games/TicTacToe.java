package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.game.TurnBasedGame;
import Strikeboom.StrikesGames.websocket.message.game.tictactoe.GiveRolesMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Arrays;
import java.util.Random;

public class TicTacToe extends TurnBasedGame {
    public final char[][] grid;
    User playerWithX;
    User playerWithO;
    public TicTacToe(Lobby lobby, SimpMessagingTemplate template) {
        super(lobby,template);
        int randomUser = new Random().nextInt(2);
        playerWithX = lobby.getUsers().get(randomUser);
        playerOnTurn = playerWithX;
        playerWithO = lobby.getUsers().get(lobby.getUsers().size() - 1 - randomUser);
        sendMessageToUsers(new GiveRolesMessage(playerWithX.getSeparationId(),"X"),playerWithX);
        sendMessageToUsers(new GiveRolesMessage(playerWithO.getSeparationId(),"O"),playerWithO);

        grid = new char[3][3];
        for (char[] row : grid) {
            Arrays.fill(row,' ');
        }
    }

    @Override
    public GameInfo getGameInfo() {
        return Games.TIC_TAC_TOE;
    }
    public char getTurnFromPlayer(User user) {
        if (getPlayerOnTurn().equals(playerWithX)) {
            return 'X';
        } else {
            return 'O';
        }
    }
}
