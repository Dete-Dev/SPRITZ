import Reveal from "@/components/Reveal";
import { StripeBand } from "@/components/ui/vandal";

/** A section that exists in the nav but is not built yet. Honest, not empty. */
export default function Placeholder({ title }: { title: string }) {
  return (
    <Reveal>
      <div className="border-2 border-ink bg-paper p-10 shadow-hard-sm">
        <h1 className="font-serif text-d-lg font-black leading-none">{title}</h1>
        <StripeBand color="var(--sp-yellow)" height={8} className="mt-4 w-24" />
        <p className="mt-5 max-w-prose font-sans text-sm leading-relaxed text-muted">
          Secțiunea e în plan, nu e construită încă. Ordinea e în
          <code className="mx-1 bg-paper-2 px-1">plan</code>: întâi catalogul și
          sincronizarea cu Shopify, apoi stocul și producția, apoi CRM-ul.
        </p>
      </div>
    </Reveal>
  );
}
