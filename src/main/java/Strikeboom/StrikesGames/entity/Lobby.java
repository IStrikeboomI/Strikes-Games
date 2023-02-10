package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Lobby {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    @NotBlank(message = "name must not be empty!")
    private String name;
    @NotBlank(message = "game name must not be empty!")
    private String game;
    private boolean isPrivate;
    @Positive(message = "max players must be positive!")
    private int maxPlayers;
    private Instant created;
    //separate from the uuid where this is used to make a quick join url by being only 7 characters long, used in the URL
    private String joinCode;
    @OneToMany(fetch = FetchType.LAZY)
    private List<User> users;
    @OneToOne(fetch = FetchType.LAZY)
    private User creator;
    private boolean gameStarted;
}
