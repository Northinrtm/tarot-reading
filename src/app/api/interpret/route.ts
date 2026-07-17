import { NextRequest, NextResponse } from "next/server";
import { interpretReading } from "@/lib/interpret";
import { getSpreadBySlug } from "@/data/spreads";
import { getCardBySlug } from "@/data/cards";
import { Reading } from "@/types/tarot";

interface InterpretRequestBody {
  spreadSlug: string;
  question?: string;
  cards: { slug: string; reversed: boolean }[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as InterpretRequestBody;

  const spread = getSpreadBySlug(body.spreadSlug);
  if (!spread) {
    return NextResponse.json({ error: "Unknown spread" }, { status: 400 });
  }

  const cards = body.cards.map(({ slug, reversed }) => {
    const card = getCardBySlug(slug);
    if (!card) {
      throw new Error(`Unknown card: ${slug}`);
    }
    return { card, reversed };
  });

  if (cards.length !== spread.positions.length) {
    return NextResponse.json({ error: "Card count does not match spread" }, { status: 400 });
  }

  const reading: Reading = { spread, cards, createdAt: new Date().toISOString() };
  const text = await interpretReading(reading, body.question);

  return NextResponse.json({ text });
}
