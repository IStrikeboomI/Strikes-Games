package Strikeboom.StrikesGames.websocket.message.lobby;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Abstract class used for creating lobby message
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class LobbyMessage {
    /**
     * Name of the message
     * Used by web-socket-messages.js to get handled
     * Standard protocol for naming is camel case first letter lowercase
     */
    String messageName;
}
