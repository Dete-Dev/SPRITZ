"use client";

import { useState, useRef, useEffect } from "react";
import { browserDb } from "@/lib/db.client";
import Cta from "@/components/ui/Cta";

/**
 * Login in two steps: email, then a six-digit code.
 *
 * It used to be a magic link, and links kept arriving dead. A magic link is a
 * single-use URL, and anything that opens a URL spends it — Gmail's scanner,
 * a corporate mail filter, a phone's link preview. The user then clicks a
 * token that was already burned by a robot and is told it was "already used",
 * which is true and completely unhelpful.
 *
 * A code cannot be spent by opening an email. It also crosses devices for
 * free: ask on the laptop, read the code on the phone, type it on the laptop.
 * The whole cross-browser PKCE problem disappears with it.
 *
 * `verifyOtp` runs in the browser, which can write cookies — a Server
 * Component cannot, and that mistake cost a debugging round earlier.
 */
type Step =
  | { at: "email" }
  | { at: "code"; email: string }
  | { at: "working" };

export default function LoginForm() {
  const [step, setStep] = useState<Step>({ at: "email" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step.at === "code") codeRef.current?.focus();
  }, [step.at]);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address) return;

    setError(null);
    setStep({ at: "working" });

    const { error: err } = await browserDb().auth.signInWithOtp({
      email: address,
      // Nobody signs up for an internal tool. Without this, any typo creates a
      // real row in auth.users that then sits there forever.
      options: { shouldCreateUser: false },
    });

    if (err) {
      // Deliberately vague: naming the reason would tell a stranger whether an
      // address has an account here.
      setError("Nu am putut trimite codul. Verifică adresa și mai încearcă.");
      setStep({ at: "email" });
      return;
    }
    setCode("");
    setStep({ at: "code", email: address });
  }

  async function verify(token: string, address: string) {
    setError(null);
    setStep({ at: "working" });

    const { error: err } = await browserDb().auth.verifyOtp({
      email: address,
      token,
      type: "email",
    });

    if (err) {
      setError("Codul nu e bun sau a expirat. Cere altul.");
      setStep({ at: "code", email: address });
      setCode("");
      return;
    }
    // Full load, not a client navigation: the session cookie was written a
    // moment ago and a soft navigation can still carry the old one.
    window.location.replace("/dashboard");
  }

  if (step.at === "code" || (step.at === "working" && code.length === 6)) {
    const address = step.at === "code" ? step.email : email;
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) verify(code, address);
        }}
        className="space-y-4"
      >
        <p className="font-sans text-sm leading-relaxed text-cream">
          Ți-am trimis un cod de 6 cifre pe <strong>{address}</strong>.
        </p>

        <label className="block">
          <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink-muted">
            Codul
          </span>
          <input
            ref={codeRef}
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={code}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(next);
              // Six digits is the whole form. Making someone reach for a
              // button after typing the last one is a step for nothing.
              if (next.length === 6) verify(next, address);
            }}
            className="mt-2 w-full border-2 border-ink-line bg-ink-2 px-4 py-3 text-center font-sans text-2xl font-bold tracking-[0.4em] text-cream outline-none transition-colors placeholder:tracking-normal placeholder:text-ink-muted focus:border-cream"
            placeholder="000000"
          />
        </label>

        <Cta type="submit" variant="invert" block>
          Intră
        </Cta>

        {error && (
          <p role="alert" className="font-sans text-sm text-red">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => sendCode()}
          className="font-sans text-xs text-ink-muted underline decoration-1 underline-offset-4 transition-colors hover:text-cream"
        >
          Trimite alt cod
        </button>
      </form>
    );
  }

  const working = step.at === "working";

  return (
    <form onSubmit={sendCode} className="space-y-4">
      <label className="block">
        <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink-muted">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-2 border-ink-line bg-ink-2 px-4 py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-ink-muted focus:border-cream"
          placeholder="nume@spritz.ro"
        />
      </label>

      <Cta type="submit" variant="invert" block>
        {working ? "Se trimite…" : "Trimite codul"}
      </Cta>

      {error && (
        <p role="alert" className="font-sans text-sm text-red">
          {error}
        </p>
      )}
    </form>
  );
}
