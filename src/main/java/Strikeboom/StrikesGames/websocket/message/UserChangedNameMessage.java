package Strikeboom.StrikesGames.websocket.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class UserChangedNameMessage extends LobbyMessage{

    UUID separationId;
    String name;
}
