"use client";

import { useState } from "react";
import { SPREADS, CUSTOM_QUESTION_SPREAD_SLUG } from "@/data/spreads";
import { drawReading } from "@/lib/tarot";
import { buildStaticInterpretation } from "@/lib/interpret";
import { Reading } from "@/types/tarot";
import { TarotCardView } from "@/components/TarotCardView";

export function SpreadReading() {
  const [spreadSlug, setSpreadSlug] = useState(SPREADS[0].slug);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<Reading | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  const spread = SPREADS.find((s) => s.slug === spreadSlug)!;
  const isCustom = spreadSlug === CUSTOM_QUESTION_SPREAD_SLUG;

  async function handleDraw() {
    const newReading = drawReading(spread);
    setReading(newReading);
    setInterpretation(buildStaticInterpretation(newReading));
    setLoading(true);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadSlug: newReading.spread.slug,
          question: isCustom && question.trim() ? question.trim() : undefined,
          cards: newReading.cards.map(({ card, reversed }) => ({ slug: card.slug, reversed })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInterpretation(data.text);
      }
    } catch {
      // остаётся базовая трактовка, уже показанная выше
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <select
          value={spreadSlug}
          onChange={(e) => {
            setSpreadSlug(e.target.value);
            setReading(null);
          }}
          className="bg-violet-950 border border-violet-400/40 rounded-md px-3 py-2 text-violet-100"
        >
          {SPREADS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <p className="text-violet-300 text-sm max-w-md text-center">{spread.description}</p>
        {isCustom && (
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Опишите свой вопрос или мысль, на которую хотите погадать…"
            rows={3}
            className="w-full max-w-md bg-violet-950 border border-violet-400/40 rounded-md px-3 py-2 text-violet-100 placeholder:text-violet-500 resize-none"
          />
        )}
        <button
          onClick={handleDraw}
          className="mt-2 px-6 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          Разложить карты
        </button>
      </div>

      {reading && (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-wrap justify-center gap-6">
            {reading.cards.map((drawn, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-violet-400 text-xs uppercase tracking-wide">
                  {reading.spread.positions[i].label}
                </span>
                <TarotCardView {...drawn} />
              </div>
            ))}
          </div>

          <div className="whitespace-pre-wrap text-violet-100 bg-violet-950/60 border border-violet-400/30 rounded-lg p-4 max-w-xl text-sm">
            {interpretation}
            {loading && <span className="text-violet-400"> …трактовка уточняется</span>}
          </div>
        </div>
      )}
    </div>
  );
}
