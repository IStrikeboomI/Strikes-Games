package Strikeboom.StrikesGames.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Validated
public class ChatMessageDto {
    String text;
    UserDto user;
    Instant created;
}
