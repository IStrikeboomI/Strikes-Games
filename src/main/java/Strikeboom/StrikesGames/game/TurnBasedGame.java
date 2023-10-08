package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import lombok.Getter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Getter
public abstract class TurnBasedGame extends Game {
    public User playerOnTurn;
    public TurnBasedGame(Lobby lobby, SimpMessagingTemplate template) {
        super(lobby,template);
        playerOnTurn = lobby.getUsers().get(0);
    }
    /**
     * changes player on turn to be the next player
     * @return player on turn after cycling
     */
    public User cycleTurn() {
        int positionOfCurrentPlayer = getLobby().getUsers().indexOf(playerOnTurn);
        if (positionOfCurrentPlayer != getLobby().getUsers().size()-1) {
            playerOnTurn = getLobby().getUsers().get(positionOfCurrentPlayer + 1);
        } else {
            playerOnTurn = getLobby().getUsers().get(0);
        }
        return playerOnTurn;
    }
}
