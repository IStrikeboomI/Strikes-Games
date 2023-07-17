package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.GameEndedData;
import Strikeboom.StrikesGames.game.GameInfo;
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
        return GameInfo.TIC_TAC_TOE;
    }

    @Override
    public void initMessages(User user) {
        if (playerWithX.equals(user)) {
            sendMessageToUsers(new GiveRolesMessage(playerWithO.getSeparationId(),"O"),playerWithX);
        } else {
            sendMessageToUsers(new GiveRolesMessage(playerWithX.getSeparationId(),"X"),playerWithO);
        }
        sendMessageToUsers(new ClientBoundGameMessage("getGrid", Map.of("grid",grid)),user);
        sendMessageToUsers(new ClientBoundGameMessage("getPlayerOnTurn", Map.of("separationId", playerOnTurn.getSeparationId())), user);
        if (gameEnded) {
            sendMessageToUsers(new ClientBoundGameMessage("gameEnded",isGameEnded().data),user);
        }
    }

    @Override
    public GameEndedData isGameEnded() {
        GameEndedData data = new GameEndedData();
        for (int i = 0; i < grid.length; i++) {
            if (checkForWin(0,i, 1,i, 2,i,'O') || checkForWin(i,0, i,1, i,2,'O') ) {
                data.setGameEnded(true);
                data.data.put("winner",'O');
            }
            if (checkForWin(0,i, 1,i, 2,i,'X') || checkForWin(i,0, i,1, i,2,'X') ) {
                data.setGameEnded(true);
                data.data.put("winner",'X');
            }
        }
        //diagonals
        if (checkForWin(0,0,1,1,2,2,'X') || checkForWin(0,2,1,1,2,0,'X')) {
            data.setGameEnded(true);
            data.data.put("winner",'X');
        }
        if (checkForWin(0,0,1,1,2,2,'O') || checkForWin(0,2,1,1,2,0,'O')) {
            data.setGameEnded(true);
            data.data.put("winner",'O');
        }
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
            data.setGameEnded(true);
            data.data.put("winner","tie");
        }
        return data;
    }
    private boolean checkForWin(int x1, int y1, int x2, int y2, int x3, int y3, char character) {
        return grid[x1][y1] == character && grid[x2][y2] == character && grid[x3][y3] == character;
    }
    @Override
    public void onGameEnded(GameEndedData data) {
        sendMessageToAll(new ClientBoundGameMessage("gameEnded",data.data));
    }

    public char getTurnFromPlayerOnTurn() {
        if (getPlayerOnTurn().equals(playerWithX)) {
            return 'X';
        } else {
            return 'O';
        }
    }
}
