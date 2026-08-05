import { CardDef, SpreadDef, SpreadPosition } from "@/types/tarot";

export type Locale = "ru" | "en";

export const UI_TEXT = {
  ru: {
    title: "Таро",
    subtitle: "Выберите расклад и вытяните карты — колода Райдера-Уэйта-Смит, 78 карт.",
    questionLabel: "О чём вы хотите спросить у карт?",
    draw: "Разложить карты",
    shuffle: "Перемешать колоду",
    reshuffle: "Перемешать ещё раз",
    message: "Послание карт",
    loading: "Карты раскрывают тайну…",
    upright: "прямая",
    reversed: "перевёрнутая",
    chooseCard: (position: string) => `Выберите карту на позицию «${position}»`,
    selected: (count: number, total: number) => `Выбрано ${count} из ${total}`,
    cardAria: (number: number) => `Выбрать закрытую карту ${number}`,
  },
  en: {
    title: "Tarot",
    subtitle: "Choose a spread and draw your cards from the 78-card Rider–Waite–Smith deck.",
    questionLabel: "What would you like to ask the cards?",
    draw: "Draw cards",
    shuffle: "Shuffle the deck",
    reshuffle: "Shuffle again",
    message: "Message from the cards",
    loading: "The cards are revealing their message…",
    upright: "upright",
    reversed: "reversed",
    chooseCard: (position: string) => `Choose a card for “${position}”`,
    selected: (count: number, total: number) => `Selected ${count} of ${total}`,
    cardAria: (number: number) => `Choose face-down card ${number}`,
  },
} as const;

const EN_SPREADS: Record<string, { name: string; description: string }> = {
  single: {
    name: "Card of the Day",
    description: "One card, one piece of guidance. A quick look at the day ahead.",
  },
  "three-card": {
    name: "Past · Present · Future",
    description: "A classic three-card spread showing how a situation develops over time.",
  },
  "situation-action-outcome": {
    name: "Situation · Action · Outcome",
    description: "A decision spread: what is happening, what to do, and where it may lead.",
  },
  "manual-situation-obstacle-advice": {
    name: "Choose the Cards Yourself",
    description: "Situation · Obstacle · Advice: shuffle the deck and intuitively choose three cards.",
  },
  "custom-question": {
    name: "Your Own Question",
    description: "A five-card spread for a question or thought of your own.",
  },
};

const EN_POSITIONS: Record<string, string> = {
  day: "Card of the Day",
  past: "Past",
  present: "Present",
  future: "Future",
  situation: "Situation",
  action: "Action",
  obstacle: "Obstacle",
  advice: "Advice",
  outcome: "Likely Outcome",
  essence: "Core of the Question",
  helps: "What Helps",
  hinders: "What Hinders",
};

const MAJOR_NAMES: Record<string, string> = {
  fool: "The Fool",
  magician: "The Magician",
  "high-priestess": "The High Priestess",
  empress: "The Empress",
  emperor: "The Emperor",
  hierophant: "The Hierophant",
  lovers: "The Lovers",
  chariot: "The Chariot",
  strength: "Strength",
  hermit: "The Hermit",
  "wheel-of-fortune": "Wheel of Fortune",
  justice: "Justice",
  "hanged-man": "The Hanged Man",
  death: "Death",
  temperance: "Temperance",
  devil: "The Devil",
  tower: "The Tower",
  star: "The Star",
  moon: "The Moon",
  sun: "The Sun",
  judgement: "Judgement",
  world: "The World",
};

const SUIT_NAMES: Record<string, string> = {
  wands: "Wands",
  cups: "Cups",
  swords: "Swords",
  pentacles: "Pentacles",
};

const RANK_NAMES: Record<string, string> = {
  ace: "Ace",
  page: "Page",
  knight: "Knight",
  queen: "Queen",
  king: "King",
};

export function getSpreadName(spread: SpreadDef, locale: Locale): string {
  return locale === "en" ? EN_SPREADS[spread.slug]?.name ?? spread.name : spread.name;
}

export function getSpreadDescription(spread: SpreadDef, locale: Locale): string {
  return locale === "en"
    ? EN_SPREADS[spread.slug]?.description ?? spread.description
    : spread.description;
}

export function getPositionLabel(position: SpreadPosition, locale: Locale): string {
  return locale === "en" ? EN_POSITIONS[position.id] ?? position.label : position.label;
}

export function getCardName(card: CardDef, locale: Locale): string {
  if (locale === "ru") return card.name;
  if (card.arcana === "major") return MAJOR_NAMES[card.slug] ?? card.name;

  const [suit, rank] = card.slug.split("-");
  const rankName = RANK_NAMES[rank] ?? String(Number(rank));
  return `${rankName} of ${SUIT_NAMES[suit] ?? suit}`;
}
