package Strikeboom.StrikesGames.websocket.message.game;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class GameMessage {
    Map<String,Object> data;
}
