package Strikeboom.StrikesGames.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Validated
public class LobbyDto {
    @NotBlank(message = "name must not be empty!")
    @Size(max = 40,message = "Name is too long! Max is 40 characters")
    private String name;
    @NotBlank(message = "game name must not be empty!")
    private String game;
    private boolean isPrivate;
    @Positive(message = "max players must be positive!")
    private int maxPlayers;
    private Instant created;
    private String joinCode;
    private List<UserDto> users;
    private boolean gameStarted;
    private List<ChatMessageDto> messages;
    private Map<String,Object> settings;
}
