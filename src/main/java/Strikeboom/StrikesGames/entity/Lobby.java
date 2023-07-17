package Strikeboom.StrikesGames.entity;

import Strikeboom.StrikesGames.game.GameInfo;
import Strikeboom.StrikesGames.game.GameSettings;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

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
    @Size(max = 40,message = "Name is too long! Max is 40 characters")
    private String name;
    @Enumerated(EnumType.STRING)
    private GameInfo game;
    private boolean isPrivate;
    @Positive(message = "max players must be positive!")
    private int maxPlayers;
    @PastOrPresent
    private Instant created;
    //separate from the uuid where this is used to make a quick join url by being only 7 characters long, used in the URL
    private String joinCode;
    @OneToMany(fetch = FetchType.EAGER,orphanRemoval = true)
    private List<User> users;
    private boolean gameStarted;
    @OneToMany(orphanRemoval = true)
    private List<ChatMessage> messages;
    @JdbcTypeCode(SqlTypes.JSON)
    private GameSettings settings;
}
