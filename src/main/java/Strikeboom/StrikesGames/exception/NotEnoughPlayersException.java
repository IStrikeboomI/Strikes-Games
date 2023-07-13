package Strikeboom.StrikesGames.exception;

public class NotEnoughPlayersException extends RuntimeException{
    public NotEnoughPlayersException(String string) {
        super(string);
    }
}
