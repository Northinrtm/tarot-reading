import { TarotCardView } from "@/components/TarotCardView";
import { DrawnCard, SpreadPosition } from "@/types/tarot";

interface ManualCardPickerProps {
  deck: DrawnCard[];
  positions: SpreadPosition[];
  selectedIndexes: number[];
  onSelect: (index: number) => void;
}

export function ManualCardPicker({
  deck,
  positions,
  selectedIndexes,
  onSelect,
}: ManualCardPickerProps) {
  const nextPosition = positions[selectedIndexes.length];

  return (
    <section className="flex w-full max-w-4xl flex-col items-center gap-6" aria-label="Выбор карт">
      <div className="grid min-h-64 w-full grid-cols-3 gap-2 sm:gap-6">
        {positions.map((position, index) => {
          const drawn = deck[selectedIndexes[index]];

          return (
            <div key={position.id} className="flex min-w-0 flex-col items-center gap-2">
              <span className="text-center text-xs uppercase tracking-wide text-violet-400">
                {position.label}
              </span>
              {drawn ? (
                <TarotCardView {...drawn} compact />
              ) : (
                <div className="flex aspect-[825/1429] w-20 items-center justify-center rounded-lg border border-dashed border-violet-400/40 bg-violet-950/30 sm:w-32">
                  <span className="text-2xl text-violet-400/50">{index + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {nextPosition && (
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-center text-sm text-violet-200" aria-live="polite">
            Выберите карту на позицию «{nextPosition.label}»
          </p>
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(32px,1fr))] gap-1.5 rounded-xl border border-violet-400/20 bg-black/20 p-3 sm:grid-cols-[repeat(13,1fr)] sm:gap-2">
            {deck.map(({ card }, index) => {
              const selected = selectedIndexes.includes(index);

              return (
                <button
                  key={card.slug}
                  type="button"
                  disabled={selected}
                  onClick={() => onSelect(index)}
                  aria-label={`Выбрать закрытую карту ${index + 1}`}
                  className="group aspect-[825/1429] min-w-0 rounded border border-violet-300/35 bg-gradient-to-br from-violet-950 via-indigo-900 to-violet-950 p-0.5 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 disabled:cursor-default disabled:opacity-15 disabled:hover:translate-y-0"
                >
                  <span className="flex h-full w-full items-center justify-center rounded-sm border border-violet-200/15 text-[9px] text-violet-200/60 group-hover:text-violet-100">
                    ✦
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-violet-400">
            Выбрано {selectedIndexes.length} из {positions.length}
          </p>
        </div>
      )}
    </section>
  );
}
