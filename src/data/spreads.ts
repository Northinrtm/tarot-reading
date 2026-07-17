import { SpreadDef } from "@/types/tarot";

export const SPREADS: SpreadDef[] = [
  {
    slug: "single",
    name: "Карта дня",
    description: "Один расклад — один совет. Быстрый взгляд на сегодняшний день.",
    positions: [{ id: "day", label: "Карта дня", hint: "На что обратить внимание сегодня" }],
  },
  {
    slug: "three-card",
    name: "Прошлое · Настоящее · Будущее",
    description: "Классический расклад из трёх карт, показывающий развитие ситуации во времени.",
    positions: [
      { id: "past", label: "Прошлое", hint: "Что привело к текущей ситуации" },
      { id: "present", label: "Настоящее", hint: "Что происходит сейчас" },
      { id: "future", label: "Будущее", hint: "К чему всё идёт" },
    ],
  },
  {
    slug: "situation-action-outcome",
    name: "Ситуация · Действие · Итог",
    description: "Расклад для принятия решения: что происходит, что делать и к чему это приведёт.",
    positions: [
      { id: "situation", label: "Ситуация", hint: "Суть текущего положения дел" },
      { id: "action", label: "Действие", hint: "Рекомендуемый шаг" },
      { id: "outcome", label: "Итог", hint: "Вероятный результат" },
    ],
  },
];

export function getSpreadBySlug(slug: string): SpreadDef | undefined {
  return SPREADS.find((s) => s.slug === slug);
}
