package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import lombok.Getter;

@Getter
public abstract class TurnBasedGame extends GameInstance{
    private Player playerOnTurn;
    public TurnBasedGame(Game game, Lobby lobby) {
        super(game, lobby);
        playerOnTurn = getPlayers().get(0);
    }

    /**
     * changes player on turn to be the next player
     */
    public void cycleTurn() {
        int positionOfCurrentPlayer = getPlayers().indexOf(playerOnTurn);
        if (positionOfCurrentPlayer != getPlayers().size()-1) {
            playerOnTurn = getPlayers().get(positionOfCurrentPlayer + 1);
        } else {
            playerOnTurn = getPlayers().get(0);
        }
    }
}
