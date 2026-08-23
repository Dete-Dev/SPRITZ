/**
 * Add redirect URLs to the linked Supabase project's auth allowlist.
 *
 * `supabase config push` is deliberately not used: it uploads the whole of
 * config.toml, which here is mostly untouched CLI defaults, so it would
 * silently overwrite Site URL, OTP expiry, SMTP and the rest of the remote
 * auth config. This touches `uri_allow_list` and nothing else.
 *
 * Reads, merges, writes back — so it is safe to run twice and never drops an
 * entry somebody added by hand in the dashboard.
 *
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/auth-redirects.mjs            # show current
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/auth-redirects.mjs --ensure    # add every URL this project needs
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/auth-redirects.mjs --add 'https://example.com/**'
 *
 * The token is a Personal Access Token from
 * https://supabase.com/dashboard/account/tokens — it is read from the
 * environment and never written anywhere.
 */
import { readFileSync } from "node:fs";

// Overridable so the merge logic can be exercised against a stub in tests.
const API = process.env.SUPABASE_API ?? "https://api.supabase.com/v1";

/**
 * Every redirect target this project actually logs in from.
 *
 * The preview pattern is not a guess: Vercel names this team's deployments
 * `spritz-<hash>-deteandrei97business-3434s-projects.vercel.app`, and branch
 * previews `spritz-git-<branch>-...`, so one wildcard covers both. Note the
 * host starts `spritz-`, not `spritz-ops-` — the deployment name is the
 * truncated project name, and the obvious guess does not match.
 *
 * The wildcard is deliberately anchored to the team suffix. A bare
 * `https://spritz-*.vercel.app/**` would hand auth tokens to anything on
 * vercel.app whose name starts with "spritz".
 */
const REQUIRED = [
  "https://spritz-ops.vercel.app/**",
  "https://spritz-*-deteandrei97business-3434s-projects.vercel.app/**",
  "http://localhost:4100/**",
];

function projectRef() {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const url = env.match(/^NEXT_PUBLIC_SUPABASE_URL=(.+)$/m)?.[1].trim();
  const ref = url?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  if (!ref) throw new Error("could not read the project ref from .env.local");
  return ref;
}

async function call(ref, token, method, body) {
  const res = await fetch(`${API}/projects/${ref}/config/auth`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    // Never echo the token, whatever the API says.
    throw new Error(`${method} config/auth -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error(
    "SUPABASE_ACCESS_TOKEN is not set.\n" +
      "Create one at https://supabase.com/dashboard/account/tokens, then:\n" +
      "  SUPABASE_ACCESS_TOKEN=sbp_... npm run auth:redirects -- --ensure",
  );
  process.exit(1);
}

const ref = projectRef();
const before = await call(ref, token, "GET");
const current = (before.uri_allow_list ?? "").split(",").map((s) => s.trim()).filter(Boolean);

console.log(`project ${ref}`);
console.log(`site_url        ${before.site_url}`);
console.log(`uri_allow_list  ${current.length ? current.join("\n                ") : "(empty)"}`);

const addIndex = process.argv.indexOf("--add");
const ensure = process.argv.includes("--ensure");
if (addIndex === -1 && !ensure) process.exit(0);

const wanted = ensure
  ? REQUIRED
  : process.argv.slice(addIndex + 1).filter((a) => !a.startsWith("--"));
if (!wanted.length) {
  console.error("--add needs at least one URL");
  process.exit(1);
}

const missing = wanted.filter((u) => !current.includes(u));
if (!missing.length) {
  console.log("\nnothing to do — already on the list");
  process.exit(0);
}

const merged = [...current, ...missing];
await call(ref, token, "PATCH", { uri_allow_list: merged.join(",") });

const after = await call(ref, token, "GET");
console.log(`\nadded: ${missing.join(", ")}`);
console.log(`now:   ${after.uri_allow_list.split(",").join("\n       ")}`);
