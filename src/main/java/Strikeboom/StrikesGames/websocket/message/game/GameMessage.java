package Strikeboom.StrikesGames.websocket.message.game;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameMessage {
    String game;
    final String messageName;
    Object data;
}
