"use client";

/**
 * The browser Supabase client. Separate file from `lib/db.ts` on purpose:
 * that one imports `next/headers`, which webpack refuses to bundle into a
 * client component. Anon key only — RLS is what protects the data.
 */
import { createBrowserClient } from "@supabase/ssr";

export function browserDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("[db] missing NEXT_PUBLIC_SUPABASE_* — see .env.local.example");
  }
  return createBrowserClient(url, anon);
}
