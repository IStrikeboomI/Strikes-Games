package Strikeboom.StrikesGames.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LobbyDto {
    private String name;
    private String game;
    private boolean isPrivate;
    private int maxPlayers;
    private Instant created;
    private String joinCode;
    private List<UserDto> users;
    private boolean gameStarted;
}
