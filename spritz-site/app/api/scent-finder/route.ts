import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  buildSystemPrompt,
  CHARACTERS,
  INTENSITIES,
  OCCASIONS,
  SCENT_KEYS,
  type FinderLocale,
} from "@/lib/finder/knowledge";

/**
 * AI scent finder endpoint. Receives the visitor's quick-picks + optional
 * free text, asks Claude (forced tool use → guaranteed JSON) for one of the
 * five scent keys plus an on-brand reason in the request locale.
 *
 * Degrades like the rest of the stack: no ANTHROPIC_API_KEY → 503, the UI
 * shows the all-five fallback instead of an error wall.
 */

export const runtime = "nodejs";

const MAX_FREE_TEXT = 280;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort per-instance rate limit — resets on deploy/cold start, which
// is acceptable at launch traffic. Swap for Upstash if it ever matters.
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (hits.size > 5000) {
    // Prune expired entries so the map can't grow unbounded.
    for (const [key, value] of hits) {
      if (value.resetAt < now) hits.delete(key);
    }
  }
  return entry.count > RATE_LIMIT;
}

interface FinderRequest {
  locale: FinderLocale;
  occasion?: string;
  intensity?: string;
  character?: string;
  freeText?: string;
}

function parseBody(raw: unknown): FinderRequest | null {
  if (typeof raw !== "object" || raw === null) return null;
  const body = raw as Record<string, unknown>;

  const locale = body.locale;
  if (locale !== "ro" && locale !== "en") return null;

  const pick = <T extends readonly string[]>(
    value: unknown,
    allowed: T,
  ): T[number] | undefined =>
    typeof value === "string" && (allowed as readonly string[]).includes(value)
      ? value
      : undefined;

  const occasion = pick(body.occasion, OCCASIONS);
  const intensity = pick(body.intensity, INTENSITIES);
  const character = pick(body.character, CHARACTERS);
  const freeText =
    typeof body.freeText === "string"
      ? body.freeText.trim().slice(0, MAX_FREE_TEXT)
      : undefined;

  if (!occasion && !intensity && !character && !freeText) return null;

  return { locale, occasion, intensity, character, freeText };
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  let parsed: FinderRequest | null = null;
  try {
    parsed = parseBody(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const preferences = [
    parsed.occasion && `Occasion: ${parsed.occasion}`,
    parsed.intensity && `Desired intensity: ${parsed.intensity}`,
    parsed.character && `Preferred character: ${parsed.character}`,
    parsed.freeText && `In their own words: "${parsed.freeText}"`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: buildSystemPrompt(parsed.locale),
      messages: [
        {
          role: "user",
          content: `A visitor is choosing between the five scents. Their preferences:\n${preferences}\n\nRecommend one.`,
        },
      ],
      tools: [
        {
          name: "recommend_scent",
          description: "Recommend exactly one of the five SPRITZ scents.",
          input_schema: {
            type: "object",
            properties: {
              scentKey: { type: "string", enum: [...SCENT_KEYS] },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              reason: { type: "string" },
            },
            required: ["scentKey", "confidence", "reason"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "recommend_scent" },
    });

    const toolUse = response.content.find(
      (block) => block.type === "tool_use",
    );
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const result = toolUse.input as {
      scentKey: string;
      confidence: number;
      reason: string;
    };
    if (!SCENT_KEYS.includes(result.scentKey)) {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    return NextResponse.json({
      scentKey: result.scentKey,
      confidence: result.confidence,
      reason: result.reason,
    });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
