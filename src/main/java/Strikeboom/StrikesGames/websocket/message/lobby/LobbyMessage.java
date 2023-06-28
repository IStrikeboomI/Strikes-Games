package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * Abstract class used for creating lobby message
 */
@Getter
@ToString
@AllArgsConstructor
public abstract class LobbyMessage {
    /**
     * Name of the message
     * Used by web-socket-messages.js to get handled
     * Standard protocol for naming is camel case first letter lowercase
     */
    final String messageName;
}
