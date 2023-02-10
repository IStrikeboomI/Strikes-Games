package Strikeboom.StrikesGames.dto;

import Strikeboom.StrikesGames.entity.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;

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
    private List<User> users;
    private User creator;
    private boolean gameStarted;
}
