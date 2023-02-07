package Strikeboom.StrikesGames.dto;

import lombok.*;

import java.time.Instant;

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
}
