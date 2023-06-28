package Strikeboom.StrikesGames.game;

import Strikeboom.StrikesGames.websocket.message.game.GameMessageHandler;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;

import java.util.Map;

@Builder
public record GameInfo(@JsonIgnore Class<? extends Game> gameInstanceClass, String name, int minPlayers, int maxPlayers,
                       @JsonIgnore Map<String,Class<? extends GameMessageHandler<?>>> messages) {
}
