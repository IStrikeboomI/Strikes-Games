package Strikeboom.StrikesGames.exception;

public class GameAlreadyStartedException extends RuntimeException{
    public GameAlreadyStartedException(String string) {
        super(string);
    }
}
