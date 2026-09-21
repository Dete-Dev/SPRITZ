/**
 * Supabase clients. Three of them, and picking the wrong one is the whole
 * security story:
 *
 *   serverDb()   — anon key + the user's cookies, runs in Server Components
 *                  and Route Handlers. RLS applies, as that user.
 *   adminDb()    — service role key. Bypasses RLS entirely. Only for the
 *                  Shopify webhook and the sync scripts, which have no user.
 *
 * The browser client lives in `lib/db.client.ts` — it cannot live here,
 * because this file imports `next/headers` and webpack will not put that in a
 * client bundle.
 *
 * `adminDb` throws if it is ever reached from the browser bundle.
 */
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const url = () => requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const anon = () => requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[db] missing env ${name} — see .env.local.example`);
  return v;
}

export async function serverDb() {
  const store = await cookies();
  return createServerClient(url(), anon(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Components cannot set cookies. The middleware refreshes the
          // session on every request, so swallowing this is correct, not lazy.
        }
      },
    },
  });
}

export function adminDb() {
  if (typeof window !== "undefined") {
    throw new Error("[db] adminDb() is server-only — it carries the service role key");
  }
  return createClient(url(), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** The signed-in staff member, or null. Null means: send them to /login. */
export async function currentStaff() {
  const db = await serverDb();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db
    .from("profiles")
    .select("id, email, name, role")
    .eq("id", user.id)
    .maybeSingle();
  return data ?? null;
}
