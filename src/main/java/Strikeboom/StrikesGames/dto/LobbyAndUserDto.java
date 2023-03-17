package Strikeboom.StrikesGames.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Validated
public class LobbyAndUserDto {
    LobbyDto lobby;
    UUID userId;
    UUID separationId;
}
