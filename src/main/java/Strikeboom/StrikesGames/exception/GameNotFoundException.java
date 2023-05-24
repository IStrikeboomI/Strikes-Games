package Strikeboom.StrikesGames.exception;

public class GameNotFoundException extends RuntimeException{
    public GameNotFoundException(String string) {
        super(string);
    }
}
