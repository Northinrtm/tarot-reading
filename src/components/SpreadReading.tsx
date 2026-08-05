"use client";

import { useState } from "react";
import { SPREADS, CUSTOM_QUESTION_SPREAD_SLUG } from "@/data/spreads";
import { drawReading, shuffleDeck } from "@/lib/tarot";
import { buildStaticInterpretation } from "@/lib/interpret";
import { DrawnCard, Reading } from "@/types/tarot";
import { TarotCardView } from "@/components/TarotCardView";
import { OracleLoader } from "@/components/OracleLoader";
import { ManualCardPicker } from "@/components/ManualCardPicker";
import {
  getPositionLabel,
  getSpreadDescription,
  getSpreadName,
  Locale,
  UI_TEXT,
} from "@/lib/i18n";

export function SpreadReading({ locale }: { locale: Locale }) {
  const [spreadSlug, setSpreadSlug] = useState(SPREADS[0].slug);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<Reading | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualDeck, setManualDeck] = useState<DrawnCard[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const spread = SPREADS.find((s) => s.slug === spreadSlug)!;
  const isCustom = spreadSlug === CUSTOM_QUESTION_SPREAD_SLUG;
  const isManual = spread.selectionMode === "manual";
  const text = UI_TEXT[locale];

  async function requestInterpretation(newReading: Reading) {
    setReading(newReading);
    setInterpretation("");
    setLoading(true);

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadSlug: newReading.spread.slug,
          locale,
          question: isCustom && question.trim() ? question.trim() : undefined,
          cards: newReading.cards.map(({ card, reversed }) => ({ slug: card.slug, reversed })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInterpretation(data.text);
      } else {
        setInterpretation(buildStaticInterpretation(newReading, locale));
      }
    } catch {
      setInterpretation(buildStaticInterpretation(newReading, locale));
    } finally {
      setLoading(false);
    }
  }

  function handleDraw() {
    void requestInterpretation(drawReading(spread));
  }

  function startManualSelection() {
    setManualDeck(shuffleDeck());
    setSelectedIndexes([]);
    setReading(null);
    setInterpretation("");
    setLoading(false);
  }

  function handleManualSelect(index: number) {
    if (selectedIndexes.includes(index) || selectedIndexes.length >= spread.positions.length) {
      return;
    }

    const nextIndexes = [...selectedIndexes, index];
    setSelectedIndexes(nextIndexes);

    if (nextIndexes.length === spread.positions.length) {
      void requestInterpretation({
        spread,
        cards: nextIndexes.map((deckIndex) => manualDeck[deckIndex]),
        createdAt: new Date().toISOString(),
      });
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
            setManualDeck([]);
            setSelectedIndexes([]);
            setInterpretation("");
          }}
          className="bg-violet-950 border border-violet-400/40 rounded-md px-3 py-2 text-violet-100"
        >
          {SPREADS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {getSpreadName(s, locale)}
            </option>
          ))}
        </select>
        {!isCustom && (
          <p className="text-violet-300 text-sm max-w-md text-center">
            {getSpreadDescription(spread, locale)}
          </p>
        )}
        {isCustom && (
          <div className="w-full max-w-md flex flex-col gap-1.5">
            <label htmlFor="question" className="text-violet-300 text-sm">
              {text.questionLabel}
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
          onClick={isManual ? startManualSelection : handleDraw}
          className="mt-2 px-6 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          {isManual && manualDeck.length > 0
            ? text.reshuffle
            : isManual
              ? text.shuffle
              : text.draw}
        </button>
      </div>

      {isManual && manualDeck.length > 0 && (
        <ManualCardPicker
          deck={manualDeck}
          positions={spread.positions}
          selectedIndexes={selectedIndexes}
          onSelect={handleManualSelect}
          locale={locale}
        />
      )}

      {reading && (
        <div className="flex flex-col items-center gap-6 w-full">
          {!isManual && (
            <div className="flex flex-wrap justify-center gap-6">
              {reading.cards.map((drawn, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-violet-400 text-xs uppercase tracking-wide">
                    {getPositionLabel(reading.spread.positions[i], locale)}
                  </span>
                  <TarotCardView {...drawn} locale={locale} />
                </div>
              ))}
            </div>
          )}

          <div className="text-violet-100 bg-violet-950/60 border border-violet-400/30 rounded-lg p-6 max-w-xl w-full text-sm leading-relaxed shadow-lg">
            {loading ? (
              <OracleLoader locale={locale} />
            ) : (
              interpretation.split(/\n{2,}/).map((paragraph, i) => {
                const summaryMatch = paragraph.match(/^(?:Итог|Summary):\s*/);
                const body = summaryMatch ? paragraph.slice(summaryMatch[0].length) : paragraph;

                return (
                  <p
                    key={i}
                    className={
                      summaryMatch
                        ? "mt-5 pt-4 border-t border-violet-400/30"
                        : i > 0
                          ? "mt-4"
                          : undefined
                    }
                  >
                    {summaryMatch && (
                      <span className="block text-violet-300 text-xs uppercase tracking-wide mb-1.5">
                        {text.message}
                      </span>
                    )}
                    {body.split("\n").map((line, j, arr) => (
                      <span key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
