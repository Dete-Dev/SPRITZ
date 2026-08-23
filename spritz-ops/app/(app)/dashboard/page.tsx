import { currentStaff } from "@/lib/db";
import Reveal from "@/components/Reveal";
import { Sticker } from "@/components/ui/vandal";
import StatCard from "@/components/StatCard";

/**
 * P0 dashboard. The numbers arrive in P1 (sales, from the Shopify sync) and
 * P2 (stock and cost, from the ledger). Until then the tiles say so out loud
 * rather than showing a convincing zero — a zero here reads as "no sales".
 */
export default async function DashboardPage() {
  const staff = await currentStaff();
  const first = staff?.name?.split(" ")[0] ?? staff?.email.split("@")[0];

  return (
    <div className="space-y-10">
      <Reveal>
        <div className="relative">
          <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.4em] text-muted">
            Panou
          </p>
          <h1 className="mt-2 font-serif text-d-lg font-black leading-[0.95]">
            Salut, {first}.
          </h1>
          <Sticker tilt={-3} className="absolute right-0 top-0 hidden sm:inline-flex">
            faza 0
          </Sticker>
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vânzări luna asta" pending="P1 — sincronizare Shopify" />
        <StatCard label="Comenzi de onorat" pending="P1 — sincronizare Shopify" />
        <StatCard label="SKU sub prag" pending="P2 — registrul de stoc" />
        <StatCard label="Marjă medie" pending="P2 — rețete și cost" />
      </div>
    </div>
  );
}
