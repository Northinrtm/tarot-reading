import Image from "next/image";
import { DrawnCard } from "@/types/tarot";

export function TarotCardView({ card, reversed }: DrawnCard) {
  return (
    <div className="flex flex-col items-center gap-2 w-32">
      <div
        className={`relative w-32 h-48 rounded-lg overflow-hidden border border-violet-400/40 bg-violet-950 shadow-lg transition-transform ${
          reversed ? "rotate-180" : ""
        }`}
      >
        <Image
          src={card.image}
          alt={card.name}
          fill
          sizes="128px"
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
