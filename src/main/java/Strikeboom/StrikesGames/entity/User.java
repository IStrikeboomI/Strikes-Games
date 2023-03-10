package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @OneToOne(fetch = FetchType.LAZY)
    private Lobby lobby;
    private boolean isCreator;
}
