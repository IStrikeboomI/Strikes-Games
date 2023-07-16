package Strikeboom.StrikesGames.exception;

public class CardNotFoundException extends RuntimeException{
    public CardNotFoundException(String string) {
        super(string);
    }
}
