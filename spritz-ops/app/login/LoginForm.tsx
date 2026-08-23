"use client";

import { useState } from "react";
import { browserDb } from "@/lib/db.client";
import Cta from "@/components/ui/Cta";

/**
 * Sign-in by six-digit code rather than by a clickable link.
 *
 * The link version kept arriving dead. The token is single-use, and mail
 * scanners fetch every URL in a message before the human sees it, so whoever
 * clicked second got "already used". A typed code gives a scanner nothing to
 * consume. It also survives being read on a different device than the one that
 * asked for it, which the magic link could not: the PKCE verifier only ever
 * exists in the browser that made the request.
 *
 * Requires the Supabase "Magic Link" email template to send `{{ .Token }}` and
 * **nothing else**. The link and the code are the same one-time token, so a
 * template that still contains `{{ .ConfirmationURL }}` lets a scanner burn the
 * code as well and puts the original bug straight back.
 */
const CODE_LENGTH = 6;

const LABEL =
  "font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink-muted";
const FIELD =
  "mt-2 w-full border-2 border-ink-line bg-ink-2 px-4 py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-ink-muted focus:border-cream";

type Step = { at: "email" } | { at: "code"; email: string };

export default function LoginForm() {
  const [step, setStep] = useState<Step>({ at: "email" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const address = email.trim();
    const { error: sendError } = await browserDb().auth.signInWithOtp({
      email: address,
    });
    setBusy(false);

    // Deliberately vague: a precise error would tell a stranger whether the
    // address exists.
    if (sendError) {
      setError("Nu am putut trimite codul. Mai încearcă.");
      return;
    }

    setCode("");
    setStep({ at: "code", email: address });
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (step.at !== "code") return;
    setBusy(true);
    setError(null);

    const { error: verifyError } = await browserDb().auth.verifyOtp({
      email: step.email,
      token: code.trim(),
      type: "email",
    });

    if (verifyError) {
      setBusy(false);
      setError("Codul nu e bun sau a expirat. Cere altul.");
      return;
    }

    // A full load, not a client-side navigation: the session cookie was written
    // a moment ago and a soft navigation can still carry the old one.
    window.location.replace("/dashboard");
  }

  if (step.at === "code") {
    return (
      <form onSubmit={verify} className="space-y-4">
        <p role="status" className="font-sans text-sm leading-relaxed text-cream">
          Am trimis un cod de {CODE_LENGTH} cifre la <strong>{step.email}</strong>.
        </p>

        <label className="block">
          <span className={LABEL}>Cod</span>
          <input
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={CODE_LENGTH}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${FIELD} text-center text-2xl tracking-[0.4em]`}
            placeholder="000000"
          />
        </label>

        <Cta type="submit" variant="invert" block>
          {busy ? "Verific…" : "Intră"}
        </Cta>

        <button
          type="button"
          onClick={() => {
            setStep({ at: "email" });
            setError(null);
          }}
          className="font-sans text-sm text-ink-muted underline decoration-2 underline-offset-4 transition-colors hover:text-cream"
        >
          Altă adresă, sau trimite din nou
        </button>

        {error && (
          <p role="alert" className="font-sans text-sm text-red">
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={requestCode} className="space-y-4">
      <label className="block">
        <span className={LABEL}>Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={FIELD}
          placeholder="nume@spritz.ro"
        />
      </label>

      <Cta type="submit" variant="invert" block>
        {busy ? "Se trimite…" : "Trimite codul"}
      </Cta>

      {error && (
        <p role="alert" className="font-sans text-sm text-red">
          {error}
        </p>
      )}
    </form>
  );
}
