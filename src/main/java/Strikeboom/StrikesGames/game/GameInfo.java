package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class GameInfo {

    @JsonIgnore
    private final Class<? extends Game> gameInstanceClass;
    private final String name;
    private final int minPlayers;
    private final int maxPlayers;
    private final List<Class<? extends GameMessageHandler<?>>> messages;
}
