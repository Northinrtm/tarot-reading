import Image from "next/image";
import { DrawnCard } from "@/types/tarot";

interface TarotCardViewProps extends DrawnCard {
  compact?: boolean;
}

export function TarotCardView({ card, reversed, compact = false }: TarotCardViewProps) {
  const width = compact ? "w-20 sm:w-32" : "w-32";

  return (
    <div className={`flex flex-col items-center gap-2 ${width}`}>
      <div
        className={`relative aspect-[825/1429] ${width} rounded-lg overflow-hidden border border-violet-400/40 bg-violet-950 shadow-lg transition-transform ${
          reversed ? "rotate-180" : ""
        }`}
      >
        <Image
          src={card.image}
          alt={card.name}
          fill
          sizes={compact ? "(min-width: 640px) 128px, 80px" : "128px"}
          className="object-cover"
        />
      </div>
      <span className="text-violet-100 text-sm font-medium text-center leading-tight">
        {card.name}
      </span>
      <div className="text-xs text-violet-300 text-center">
        {reversed ? "перевёрнутая" : "прямая"}
      </div>
    </div>
  );
}
