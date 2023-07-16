package Strikeboom.StrikesGames.game.card;

import Strikeboom.StrikesGames.exception.SplitSizeNotEvenException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    public List<Card> cards;
    public Deck(List<Card> cards) {
        this.cards = cards;
    }
    public Deck() {
        this.cards = new ArrayList<>();
    }
    /**
     * Creates an un-shuffled 52 deck of cards that do not contain jokers <br>
     * Generates cards from Ace (1) to King (13) in the suit order spade, club, heart, and heart
     * @return Deck of cards
     */
    public static Deck standard52Deck() {
        List<Card> cards = new ArrayList<>();
        for (Card.Suit suit : Card.Suit.values()) {
            if (suit.isSymbol) {
                for (Card.Value value : Card.Value.values()) {
                    if (value != Card.Value.JOKER) {
                        cards.add(new Card(suit,value));
                    }
                }
            }
        }
        return new Deck(cards);
    }
    /**
     * creates an un-shuffled 54 deck of cards that does contain jokers <br>
     * Generates cards same order as {@link #standard52Deck()} but with red and black jokers at the end
     * @return Deck of cards
     */
    public static Deck standard54Deck() {
        return Deck.standard52Deck()
                .addCard(new Card(Card.Suit.RED, Card.Value.JOKER))
                .addCard(new Card(Card.Suit.BLACK, Card.Value.JOKER));
    }
    public boolean containsCard(Card card) {
        return cards.contains(card);
    }
    public Deck addCard(Card card) {
        cards.add(card);
        return this;
    }
    public int size() {
        return cards.size();
    }
    public Deck removeCard(Card card) {
        cards.remove(card);
        return this;
    }
    public Deck removeCards(List<Card> cards) {
        this.cards.removeAll(cards);
        return this;
    }
    public Deck shuffle() {
        Collections.shuffle(cards);
        return this;
    }
    public Deck sort() {
        Collections.sort(cards);
        return this;
    }

    /**
     * Split off n cards into a separate deck and removes from original
     * @param n how many cards to split off, must be positive
     * @return split off deck
     */
    public Deck splitOff(int n) {
        if (n <= 0) {
            throw new IllegalArgumentException("split off size must be positive!");
        }
        if (size() < n) {
            throw new IllegalArgumentException("Not enough cards in original deck to split off!");
        }
        List<Card> splitCards = new ArrayList<>(cards.subList(0,n));
        removeCards(splitCards);
        return new Deck(splitCards);
    }
    /**
     * Splits deck into n decks <br>
     * Empties original deck if successful <br>
     * @param size the amount of decks to split into, must be divisible into deck size
     * @return split decks
     */
    public List<Deck> split(int size) {
        if (size <= 0) {
            throw new IllegalArgumentException("size must be greater than 0!");
        }
        if (cards.size() % size != 0 && size() > 0) {
            throw new SplitSizeNotEvenException(String.format("Cannot evenly split a deck of %s cards into %s decks!",cards.size(),size));
        }
        int deckSize = cards.size();
        List<Deck> decks = new ArrayList<>(size);
        for (int i = 0;i < size;i++) {
            decks.add(splitOff(deckSize / size));
        }
        return decks;
    }
    @Override
    public String toString() {
        return "Deck{" +
                "cards=" + cards +
                '}';
    }
}
