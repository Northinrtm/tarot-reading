import Groq from "groq-sdk";
import { Reading } from "@/types/tarot";

const GROQ_MODEL = "llama-3.1-8b-instant";

/**
 * Собирает трактовку расклада из фиксированных значений карт.
 * Работает без внешних сервисов — используется как запасной вариант,
 * если ключ Groq не задан или запрос к API не удался.
 */
export function buildStaticInterpretation(reading: Reading): string {
  const lines = reading.cards.map(({ card, reversed }, i) => {
    const position = reading.spread.positions[i];
    const meaning = reversed ? card.reversed : card.upright;
    const orientation = reversed ? "перевёрнутая" : "прямая";
    return `${position.label}: ${card.name} (${orientation}) — ${meaning}.`;
  });

  return lines.join("\n");
}

function buildPrompt(reading: Reading, question?: string): string {
  const cardLines = reading.cards
    .map(({ card, reversed }, i) => {
      const position = reading.spread.positions[i];
      const meaning = reversed ? card.reversed : card.upright;
      const orientation = reversed ? "перевёрнутая" : "прямая";
      return `- ${position.label}: ${card.name} (${orientation}) — ключевые значения: ${meaning}`;
    })
    .join("\n");

  const questionLine = question
    ? `Человек задал такой вопрос: «${question}»\nОтвечай по существу именно на этот вопрос, используя карты как основу для ответа.\n`
    : "";

  return `Ты — опытный таролог. Дай связную, тёплую и содержательную трактовку расклада "${reading.spread.name}" (${reading.spread.description}).
${questionLine}Карты расклада:
${cardLines}

Обращайся напрямую к человеку — на "вы" (например, "вас ждёт", "вам стоит"), а не в третьем лице. Пиши только на русском языке, без вкраплений слов и фрагментов из других языков.

Не пиши вступлений и мета-комментариев о самом раскладе или процессе гадания (не пиши фразы вроде "давайте разберёмся", "что говорит нам расклад", "начнём с анализа карт", "ваш вопрос имеет для меня значение") — сразу отвечай по сути, как будто даёшь живой устный ответ на заданный вопрос, органично опираясь на карты. Напиши единый текст без списков и заголовков, 150-250 слов.`;
}

/**
 * AI-трактовка через Groq (модель llama-3.1-8b-instant, бесплатный tier
 * с лимитом 14.4K запросов/день — подходит для этого объёма трафика).
 * При отсутствии GROQ_API_KEY или ошибке запроса используется
 * buildStaticInterpretation как запасной вариант.
 */
export async function interpretReading(reading: Reading, question?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set in this environment, using static interpretation");
    return buildStaticInterpretation(reading);
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: buildPrompt(reading, question) }],
      temperature: 0.8,
      max_tokens: 500,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text || buildStaticInterpretation(reading);
  } catch (error) {
    console.error("Groq interpretation failed, falling back to static text:", error);
    return buildStaticInterpretation(reading);
  }
}
