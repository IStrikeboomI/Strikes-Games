package Strikeboom.StrikesGames.entity;

import jakarta.persistence.*;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    @NotBlank(message = "name must not be empty!")
    private String name;
    @OneToOne(fetch = FetchType.LAZY)
    private Lobby lobby;
    private HttpSession session;
}
