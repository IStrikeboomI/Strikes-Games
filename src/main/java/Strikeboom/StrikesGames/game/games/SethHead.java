package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.Games;
import Strikeboom.StrikesGames.game.TurnBasedGame;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class SethHead extends TurnBasedGame {
    public SethHead(Lobby lobby, SimpMessagingTemplate template) {
        super(lobby,template);
    }

    @Override
    public GameInfo getGameInfo() {
        return Games.SETH_HEAD;
    }

    @Override
    public void initMessages(User user) {

    }
}
