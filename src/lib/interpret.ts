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
    ? `Человек задал такой вопрос: «${question}»\nОтвечай по существу именно на этот вопрос, используя карты как основу для ответа. Первое предложение должно органично отвечать на суть заданного вопроса своими словами (не цитируя его дословно и не называя позицию расклада), и только затем упоминать первую карту.\n`
    : "";

  return `Ты — опытный таролог. Дай связную, тёплую и содержательную трактовку расклада "${reading.spread.name}" (${reading.spread.description}).
${questionLine}Карты расклада:
${cardLines}

Обращайся напрямую к человеку — на "вы" (например, "вас ждёт", "вам стоит"), а не в третьем лице.

Пиши строго на русском языке. Это жёсткое требование: ни одна буква латинского алфавита не должна появиться нигде в тексте, даже внутри русских слов (например, недопустимо написание вроде "капitулировать" — только "капитулировать"). Перед тем как закончить, мысленно проверь каждое слово на отсутствие латинских букв.

Запрещено начинать текст со вступления или мета-комментария о самом раскладе, вопросе или процессе гадания. Категорически нельзя использовать фразы и их аналоги: "давайте разберёмся", "что говорит нам расклад", "начнём с анализа карт", "вы обратились ко мне", "ваш вопрос имеет для меня значение", "итак", а также нельзя начинать текст с формального названия первой позиции расклада (например, нельзя начинать с "Выпавшая на позицию «${reading.spread.positions[0].label}» карта...").

Начиная со второй карты, для каждой позиции расклада явно назови выпавшую карту и объясни, что она означает в этой позиции (например: "На позиции «${reading.spread.positions[1]?.label ?? reading.spread.positions[0].label}» выпал(а) [название карты] — это говорит о..."), а затем свяжи это значение с ответом на вопрос. Ни одна карта, включая последнюю, не должна остаться без объяснения.

Структура текста строго из двух частей, разделённых пустой строкой:
1) Основная часть — разбор каждой карты по позициям, как описано выше.
2) Отдельный последний абзац, который начинается ровно со слова "Итог:" и затем даёт краткий связный вывод (2-4 предложения), объединяющий все карты в общий ответ на вопрос.

Не используй никакие другие списки или заголовки, кроме этого одного слова "Итог:" в начале последнего абзаца. Общий объём — 250-350 слов.`;
}

// Разрешаем латиницу только внутри названий позиций/карт не встречается,
// поэтому наличие латинских букв в ответе — верный признак сбоя модели.
const LATIN_LETTERS = /[a-zA-Z]/;

async function requestGroqInterpretation(
  groq: Groq,
  reading: Reading,
  question: string | undefined,
): Promise<string | undefined> {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [{ role: "user", content: buildPrompt(reading, question) }],
    temperature: 0.8,
    max_tokens: 900,
  });

  return completion.choices[0]?.message?.content?.trim();
}

/**
 * AI-трактовка через Groq (модель llama-3.1-8b-instant, бесплатный tier
 * с лимитом 14.4K запросов/день — подходит для этого объёма трафика).
 * При отсутствии GROQ_API_KEY, ошибке запроса или испорченном ответе
 * (смешение латиницы с кириллицей) используется buildStaticInterpretation.
 */
export async function interpretReading(reading: Reading, question?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set in this environment, using static interpretation");
    return buildStaticInterpretation(reading);
  }

  try {
    const groq = new Groq({ apiKey });

    let text = await requestGroqInterpretation(groq, reading, question);
    if (text && LATIN_LETTERS.test(text)) {
      console.error("Groq response contained Latin letters, retrying once:", text);
      text = await requestGroqInterpretation(groq, reading, question);
    }

    if (!text || LATIN_LETTERS.test(text)) {
      console.error("Groq response still invalid after retry, falling back to static text");
      return buildStaticInterpretation(reading);
    }

    return text;
  } catch (error) {
    console.error("Groq interpretation failed, falling back to static text:", error);
    return buildStaticInterpretation(reading);
  }
}
