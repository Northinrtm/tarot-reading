import { CARDS } from "@/data/cards";
import { DrawnCard, Reading, SpreadDef } from "@/types/tarot";

function shuffle<T>(items: T[]): T[] {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function drawReading(spread: SpreadDef, allowReversed = true): Reading {
  const cards = shuffleDeck(allowReversed).slice(0, spread.positions.length);

  return {
    spread,
    cards,
    createdAt: new Date().toISOString(),
  };
}

export function shuffleDeck(allowReversed = true): DrawnCard[] {
  return shuffle(CARDS).map((card) => ({
    card,
    reversed: allowReversed && Math.random() < 0.5,
  }));
}
