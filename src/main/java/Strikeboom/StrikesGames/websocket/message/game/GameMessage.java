package Strikeboom.StrikesGames.websocket.message.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameMessage {
    String game;
    String messageName;
    Object data;
}
