"use client";

import { useEffect, useRef, useState } from "react";
import { browserDb } from "@/lib/db.client";

/**
 * Turns whatever the magic link brought into a session, then leaves.
 *
 * Supabase sends one of two shapes, and which one depends on where the link is
 * opened:
 *
 *   ?code=...          PKCE. This browser asked for the link, so it still holds
 *                      the verifier and can exchange the code.
 *
 *   #access_token=...  Implicit. Asked for on a laptop, opened on a phone — a
 *                      different browser, no verifier, so Supabase hands the
 *                      tokens back in the fragment instead. Fragments are never
 *                      sent to a server, so only client code can see this one.
 *
 * Both are handled here because both happen. Handling only the first bounces
 * every cross-device login back to /login forever, with nothing in any log.
 *
 * A session is still not access — the app layout checks the staff allowlist.
 */
export default function CompleteSignIn() {
  const [failed, setFailed] = useState(false);
  // The code is single-use: exchanging it a second time always fails, because
  // supabase-js drops the PKCE verifier as soon as the first exchange lands.
  // React Strict Mode runs this effect twice in dev (App Router has it on by
  // default), so without the guard every local login reported a dead link.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const db = browserDb();
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));

    // Supabase reports a dead or already-used link this way.
    if (query.get("error") || hash.get("error")) {
      setFailed(true);
      return;
    }

    const done = (ok: boolean) => {
      if (!ok) {
        setFailed(true);
        return;
      }
      // Take the tokens out of the address bar before moving on. They stay in
      // history otherwise, and history gets read over a shoulder more often
      // than anyone plans for.
      window.history.replaceState(null, "", window.location.pathname);
      // A full load, not a client-side navigation: the cookie was written a
      // moment ago and a soft navigation can still carry the old one, leaving
      // the page stuck on "Te conectez…".
      window.location.replace("/dashboard");
    };

    const code = query.get("code");
    if (code) {
      db.auth.exchangeCodeForSession(code).then(({ error }) => done(!error));
      return;
    }

    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    if (access_token && refresh_token) {
      db.auth.setSession({ access_token, refresh_token }).then(({ error }) => done(!error));
      return;
    }

    // Somebody opened this URL by hand.
    setFailed(true);
  }, []);

  return (
    <main className="sp-surface-ink flex min-h-screen items-center justify-center bg-ink px-gutter">
      <p role="status" className="text-center font-sans text-sm leading-relaxed text-cream">
        {failed ? (
          <>
            Linkul nu mai e valabil sau a fost deja folosit.
            <br />
            <a href="/login" className="underline decoration-2 underline-offset-4">
              Cere altul
            </a>
          </>
        ) : (
          "Te conectez…"
        )}
      </p>
    </main>
  );
}
