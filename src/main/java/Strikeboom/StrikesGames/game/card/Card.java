package Strikeboom.StrikesGames.game.card;

import Strikeboom.StrikesGames.exception.CardNotFoundException;
import lombok.AllArgsConstructor;

import java.util.Arrays;
import java.util.List;

@AllArgsConstructor
public class Card implements Comparable<Card>{
    public Suit suit;
    public Value value;

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Card card) {
            return card.suit == suit && card.value == value;
        }
        return super.equals(obj);
    }

    /**
     * Card converted to string is letter of suit then defaultValue
     */
    @Override
    public String toString() {
        return suit.letter + value.value;
    }
    public static Card fromString(String string) {
        char suit = string.charAt(0);
        String value = string.substring(1);

        for (Suit s : Suit.values()) {
            if (s.letter == suit) {
                for (Value v : Value.values()) {
                    if (value.equals(v.value)) {
                        return new Card(s,v);
                    }
                }
            }
        }
        throw new CardNotFoundException(String.format("Card %s not found!",string));
    }

    /**
     * Cards are ranked first by suit then by defaultValue <br>
     * Suits are ranked from spades, clubs, hearts, and diamonds <br>
     * Values are ranked from 1 through 10 then jack, queen, and king <br>
     * Jokers are last, first red then black <br>
     */
    @Override
    public int compareTo(Card c) {
        List<Suit> suits = Arrays.stream(Suit.values()).toList();
        //same suit
        if (suits.indexOf(suit) == suits.indexOf(c.suit)) {
            List<Value> values = Arrays.stream(Value.values()).toList();
            return Integer.compare(values.indexOf(value),values.indexOf(c.value));
        } else {
            //if suits are different
            return Integer.compare(suits.indexOf(suit),suits.indexOf(c.suit));
        }
    }

    public enum Suit {
        SPADES('S',true),
        CLUBS('C',true),
        HEARTS('H',true),
        DIAMONDS('D',true),
        //used for joker
        RED('R',false),
        BLACK('B',false);

        final char letter;
        final boolean isSymbol;
        Suit(char letter, boolean isSymbol) {
            this.letter = letter;
            this.isSymbol = isSymbol;
        }
    }
    public enum Value {
        ONE("1"),
        TWO("2"),
        THREE("3"),
        FOUR("4"),
        FIVE("5"),
        SIX("6"),
        SEVEN("7"),
        EIGHT("8"),
        NINE("9"),
        TEN("10"),
        JACK("J"),
        QUEEN("Q"),
        KING("K"),
        JOKER("J");
        final String value;
        Value(String value) {
            this.value = value;
        }
    }
}
