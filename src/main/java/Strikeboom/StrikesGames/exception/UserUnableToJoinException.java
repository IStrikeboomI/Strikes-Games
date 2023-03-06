package Strikeboom.StrikesGames.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UserUnableToJoinException extends RuntimeException {
    public UserUnableToJoinException(String reason) {
        super(reason);
    }
}
