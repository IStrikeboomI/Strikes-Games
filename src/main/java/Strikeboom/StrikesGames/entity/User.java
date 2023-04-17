package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "`user`")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    //sent to client to help it differentiate users, only used to send data, not receive
    private UUID separationId = UUID.randomUUID();
    @NotBlank(message = "name must not be empty!")
    private String name;
    @OneToOne(fetch = FetchType.EAGER)
    //exclude lobby from string to prevent a stackoverflow exception
    @ToString.Exclude
    private Lobby lobby;
    private boolean isCreator;
}
