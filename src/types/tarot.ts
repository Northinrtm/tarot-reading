export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export interface CardDef {
  slug: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  number?: number;
  image: string;
  upright: string;
  reversed: string;
}

export interface DrawnCard {
  card: CardDef;
  reversed: boolean;
}

export interface SpreadPosition {
  id: string;
  label: string;
  hint: string;
}

export interface SpreadDef {
  slug: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

export interface Reading {
  spread: SpreadDef;
  cards: DrawnCard[];
  createdAt: string;
}
