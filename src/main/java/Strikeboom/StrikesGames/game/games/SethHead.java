package Strikeboom.StrikesGames.game.games;

import Strikeboom.StrikesGames.entity.Lobby;
import Strikeboom.StrikesGames.entity.User;
import Strikeboom.StrikesGames.game.GameEndedData;
import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.TurnBasedGame;
import Strikeboom.StrikesGames.game.card.Card;
import Strikeboom.StrikesGames.game.card.Deck;
import Strikeboom.StrikesGames.websocket.message.game.ClientBoundGameMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class SethHead extends TurnBasedGame {
    public Deck
            //Pile of cards on the side where people draw from
            extraCards,
            //Cards where people play onto
            pile;
    public Map<User, Deck>
            //Cards each player has that's only visible to the owner of cards
            //Players start off with 4 cards here
            hands,
            //At least three cards which are visible to all players, needs to be replenished from the player's hand when used
            visibleCards;
    public SethHead(Lobby lobby, SimpMessagingTemplate template) {
        super(lobby,template);
        extraCards = Deck.standard54Deck().shuffle();
        Card topValidCard = extraCards.getFirstCard();
        for (int i = 1;i < extraCards.size();i++) {
            if (topValidCard.value != Card.Value.JOKER && topValidCard.value != Card.Value.JACK) {
                break;
            }
            topValidCard = extraCards.cards.get(i);
        }
        extraCards.removeCard(topValidCard);
        pile = new Deck().addCard(topValidCard);
        hands = new HashMap<>();
        visibleCards = new HashMap<>();
        for (User user : lobby.getUsers()) {
            hands.put(user, extraCards.splitOff(4).sort());
            visibleCards.put(user, extraCards.splitOff(3).sort());
        }
    }

    @Override
    public GameInfo getGameInfo() {
        return GameInfo.SETH_HEAD;
    }

    @Override
    public void initMessages(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("extraCardsSize",extraCards.size());
        data.put("topPileCard",pile.getLastCard());
        for (User u : hands.keySet()) {
            if (user.equals(u)) {
                data.put("hand",hands.get(u));
                break;
            }
        }
        Map<UUID, Integer> handsSize = new HashMap<>();
        for (User u : hands.keySet()) {
            if (!u.equals(user)) {
                handsSize.put(u.getSeparationId(),hands.get(u).size());
            }
        }
        data.put("handsSize",handsSize);
        Map<UUID,Deck> visibleCardsByUUID = new HashMap<>();
        for (User u : visibleCards.keySet()) {
            visibleCardsByUUID.put(u.getSeparationId(),visibleCards.get(u));
        }
        data.put("visibleCards",visibleCardsByUUID);
        data.put("playerOnTurn",playerOnTurn.getSeparationId());
        sendMessageToUsers(new ClientBoundGameMessage("getGameData",data),user);
    }

    @Override
    public GameEndedData isGameEnded() {
        GameEndedData gameEndedData = new GameEndedData();
        for (User u : getLobby().getUsers()) {
            if (visibleCards.containsKey(u) && hands.containsKey(u)) {
                if (visibleCards.get(u).size() == 0 && hands.get(u).size() == 0) {
                    gameEndedData.gameEnded = true;
                    gameEndedData.data.put("winner",u.getSeparationId());
                }
            }
        }
        return gameEndedData;
    }

    @Override
    public void onGameEnded(GameEndedData data) {
        sendMessageToAll(new ClientBoundGameMessage("gameEnded",data.data));
    }
}
