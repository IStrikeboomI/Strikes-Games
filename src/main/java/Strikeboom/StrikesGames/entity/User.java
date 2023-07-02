package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@ToString
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
    @OneToMany(orphanRemoval = true,fetch = FetchType.EAGER)
    private List<ChatMessage> messages;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof User user) {
            return user.id.equals(this.id);
        }
        if (obj instanceof UUID uuid) {
            return uuid.equals(id);
        }
        return super.equals(obj);
    }
}
