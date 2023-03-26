package Strikeboom.StrikesGames.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserInsufficientPermissions extends ResponseStatusException {
    public UserInsufficientPermissions(String string) {super(HttpStatus.FORBIDDEN,string);};
}
