package Strikeboom.StrikesGames.websocket.message.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.Map;

@Getter
@ToString
@AllArgsConstructor
public class GameMessage {
    Map<String,Object> data;
}
