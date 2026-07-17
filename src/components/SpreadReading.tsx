"use client";

import { useState } from "react";
import { SPREADS, CUSTOM_QUESTION_SPREAD_SLUG } from "@/data/spreads";
import { drawReading } from "@/lib/tarot";
import { buildStaticInterpretation } from "@/lib/interpret";
import { Reading } from "@/types/tarot";
import { TarotCardView } from "@/components/TarotCardView";
import { OracleLoader } from "@/components/OracleLoader";

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
    setInterpretation("");
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
      } else {
        setInterpretation(buildStaticInterpretation(newReading));
      }
    } catch {
      setInterpretation(buildStaticInterpretation(newReading));
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
          <div className="w-full max-w-md flex flex-col gap-1.5">
            <label htmlFor="question" className="text-violet-300 text-sm">
              О чём вы хотите спросить у карт?
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full bg-violet-950/60 border border-violet-400/40 rounded-lg px-4 py-3 text-violet-100 placeholder:text-violet-500 resize-none shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
            />
          </div>
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

          <div className="text-violet-100 bg-violet-950/60 border border-violet-400/30 rounded-lg p-6 max-w-xl w-full text-sm leading-relaxed shadow-lg">
            {loading ? (
              <OracleLoader />
            ) : (
              interpretation.split(/\n{2,}/).map((paragraph, i) => (
                <p key={i} className={i > 0 ? "mt-4" : undefined}>
                  {paragraph.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
