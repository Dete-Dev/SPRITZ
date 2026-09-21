import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/email";

/**
 * Newsletter capture behind the sticky 20% badge. POST { email } → { code }.
 *
 * ponytail: emails land in the server log only — Vercel's filesystem is
 * read-only, so there is no durable store here. Swap the `console.log` below
 * for a Marketplace store (Postgres/Redis) or an ESP call when signups
 * actually need to be retrievable; nothing else in this file changes.
 */

export const runtime = "nodejs";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_CODE = "SPRITZ20";

// Best-effort per-instance rate limit, mirroring app/api/scent-finder/route.ts.
// Resets on deploy/cold start, which is fine at launch traffic.
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
    for (const [key, value] of hits) {
      if (value.resetAt < now) hits.delete(key);
    }
  }
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request): Promise<NextResponse> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const email =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>).email
      : undefined;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const locale =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>).locale
      : undefined;

  console.log(
    JSON.stringify({
      event: "newsletter_signup",
      email: normalizeEmail(email as string),
      locale: locale === "en" || locale === "ro" ? locale : null,
      at: new Date().toISOString(),
    }),
  );

  return NextResponse.json({
    code: process.env.NEWSLETTER_DISCOUNT_CODE || DEFAULT_CODE,
  });
}
