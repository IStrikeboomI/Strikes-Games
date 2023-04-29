package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    @NotEmpty
    private String text;
    @ManyToOne(fetch = FetchType.LAZY)
    private Lobby lobby;
    private Instant created;
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
