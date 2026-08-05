import Image from "next/image";
import { DrawnCard } from "@/types/tarot";
import { getCardName, Locale, UI_TEXT } from "@/lib/i18n";

interface TarotCardViewProps extends DrawnCard {
  compact?: boolean;
  locale: Locale;
}

export function TarotCardView({ card, reversed, compact = false, locale }: TarotCardViewProps) {
  const width = compact ? "w-20 sm:w-32" : "w-32";
  const cardName = getCardName(card, locale);

  return (
    <div className={`flex flex-col items-center gap-2 ${width}`}>
      <div
        className={`relative aspect-[825/1429] ${width} rounded-lg overflow-hidden border border-violet-400/40 bg-violet-950 shadow-lg transition-transform ${
          reversed ? "rotate-180" : ""
        }`}
      >
        <Image
          src={card.image}
          alt={cardName}
          fill
          sizes={compact ? "(min-width: 640px) 128px, 80px" : "128px"}
          className="object-cover"
        />
      </div>
      <span className="text-violet-100 text-sm font-medium text-center leading-tight">
        {cardName}
      </span>
      <div className="text-xs text-violet-300 text-center">
        {reversed ? UI_TEXT[locale].reversed : UI_TEXT[locale].upright}
      </div>
    </div>
  );
}
