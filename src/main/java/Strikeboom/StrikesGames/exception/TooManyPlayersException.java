package Strikeboom.StrikesGames.exception;

public class TooManyPlayersException extends RuntimeException{
    public TooManyPlayersException(String string) {
        super(string);
    }
}
