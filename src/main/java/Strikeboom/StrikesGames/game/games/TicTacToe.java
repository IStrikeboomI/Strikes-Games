package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.game.TurnBasedGame;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import Strikeboom.StrikesGames.websocket.message.game.tictactoe.GiveRolesMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Arrays;
import java.util.Map;
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

        grid = new char[3][3];
        for (char[] row : grid) {
            Arrays.fill(row,' ');
        }
    }

    @Override
    public GameInfo getGameInfo() {
        return Games.TIC_TAC_TOE;
    }

    @Override
    public void initMessages(User user) {
        if (playerWithX.equals(user)) {
            sendMessageToUsers(new GiveRolesMessage(playerWithO.getSeparationId(),"O"),playerWithX);
        } else {
            sendMessageToUsers(new GiveRolesMessage(playerWithX.getSeparationId(),"X"),playerWithO);
        }
        sendMessageToUsers(new ClientBoundGameMessage("getGrid", Map.of("grid",grid)),user);
        sendMessageToUsers(new ClientBoundGameMessage("getPlayerOnTurn", Map.of("separationId",playerOnTurn.getSeparationId())),user);
    }

    @Override
    public boolean isGameEnded() {
        //check for tie by seeing if all grids all filled
        int filledGrids = 0;
        for (char[] row : grid) {
            for (char move : row) {
                if (move != ' ') {
                    filledGrids++;
                }
            }
        }
        if (filledGrids == 9) {
            return true;
        }
        return false;
    }
    private boolean checkForWin(int x1, int y1, int x2, int y2, int x3, int y3, char character) {
        return grid[x1][y1] == character && grid[x2][y2] == character && grid[x3][y3] == character;
    }
    @Override
    public void onGameEnded() {

    }

    public char getTurnFromPlayerOnTurn() {
        if (getPlayerOnTurn().equals(playerWithX)) {
            return 'X';
        } else {
            return 'O';
        }
    }
}
