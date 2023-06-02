package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import lombok.Getter;

@Getter
public abstract class TurnBasedGame extends Game {
    private User playerOnTurn;
    public TurnBasedGame(Lobby lobby) {
        super(lobby);
        playerOnTurn = lobby.getUsers().get(0);
    }
    /**
     * changes player on turn to be the next player
     */
    public void cycleTurn() {
        int positionOfCurrentPlayer = getLobby().getUsers().indexOf(playerOnTurn);
        if (positionOfCurrentPlayer != getLobby().getUsers().size()-1) {
            playerOnTurn = getLobby().getUsers().get(positionOfCurrentPlayer + 1);
        } else {
            playerOnTurn = getLobby().getUsers().get(0);
        }
    }
}
