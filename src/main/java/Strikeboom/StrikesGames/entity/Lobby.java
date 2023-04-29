package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @NotBlank(message = "game name must not be empty!")
    private String game;
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
    @OneToMany()
    private List<ChatMessage> messages;
}
