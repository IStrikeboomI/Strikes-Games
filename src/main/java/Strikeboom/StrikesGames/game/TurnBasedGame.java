package Strikeboom.StrikesGames.game;

public abstract class TurnBasedGame extends GameInstance{
    private Player playerOnTurn;
    public TurnBasedGame(Game game) {
        super(game);
        playerOnTurn = getPlayers().get(0);
    }
}
