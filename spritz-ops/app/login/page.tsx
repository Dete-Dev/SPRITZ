import LoginForm from "./LoginForm";
import { Sticker, Spray, StripeBand } from "@/components/ui/vandal";

/**
 * The door. It is an internal tool, but it is still SPRITZ — ink surface,
 * Alegreya display, one sticker. House rule holds: three vandal elements,
 * no more.
 */
export default function LoginPage() {
  return (
    <main className="sp-surface-ink sp-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-gutter">
      <Spray color="var(--sp-red)" opacity={0.35} className="absolute -left-40 top-0 h-[36rem] w-[36rem]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10">
          <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.4em] text-ink-muted">
            Uz intern
          </p>
          <h1 className="mt-3 font-serif text-d-xl font-black leading-[0.9] text-cream">
            SPRITZ
            <br />
            OPS
          </h1>
          <StripeBand color="var(--sp-red)" height={10} className="mt-5 w-32" />
        </div>

        <LoginForm />

        <p className="mt-8 font-sans text-xs leading-relaxed text-ink-muted">
          Primești un cod pe email. Fără parolă. Dacă adresa nu e pe listă,
          codul sosește dar nu deschide nimic.
        </p>

        <Sticker tilt={-4} variant="ink" fill="var(--sp-red)" className="absolute -right-2 -top-6">
          doar echipa
        </Sticker>
      </div>
    </main>
  );
}
