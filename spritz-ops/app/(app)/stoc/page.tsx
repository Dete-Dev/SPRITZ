import Reveal from "@/components/Reveal";
import { StripeBand } from "@/components/ui/vandal";
import PageHead from "@/components/PageHead";
import Empty from "@/components/Empty";
import { materialsWithStock, skuCosts, suppliers } from "@/lib/queries";
import { money, qty, num, kindLabel, marginPct } from "@/lib/format";
import { AddMaterial, AdjustStock } from "./MaterialForms";

export const dynamic = "force-dynamic";

export default async function StocPage() {
  const [materials, costs, sups] = await Promise.all([
    materialsWithStock(),
    skuCosts(),
    suppliers(),
  ]);

  const low = materials.filter((m) => m.on_hand < num(m.reorder_point));

  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="Stoc"
        title="Ce avem în casă"
        note={
          low.length > 0
            ? `${low.length} ${low.length === 1 ? "material e" : "materiale sunt"} sub prag.`
            : undefined
        }
      />

      <Reveal>
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-d-lg font-black leading-none">Materii prime</h2>
            <StripeBand color="var(--sp-blue)" height={6} thin className="hidden flex-1 sm:block" />
          </div>

          {materials.length === 0 ? (
            <Empty>
              Niciun material încă. Adaugă-le mai jos — sticla, capacul, eticheta, cutia,
              alcoolul și concentratul fiecărui parfum.
            </Empty>
          ) : (
            <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Cod</th>
                    <th>Material</th>
                    <th>Tip</th>
                    <th className="ops-num">În stoc</th>
                    <th className="ops-num">Prag</th>
                    <th className="ops-num">Cost / unit.</th>
                    <th>Furnizor</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => {
                    const under = m.on_hand < num(m.reorder_point);
                    return (
                      <tr key={m.id}>
                        <td className="font-sans text-xs font-bold tracking-wide">{m.code}</td>
                        <td>{m.name}</td>
                        <td className="font-sans text-xs uppercase tracking-wide text-muted">
                          {kindLabel(m.kind)}
                        </td>
                        <td className={`ops-num font-bold ${under ? "text-red" : ""}`}>
                          {qty(m.on_hand, m.unit)}
                        </td>
                        <td className="ops-num text-muted">{qty(m.reorder_point, m.unit)}</td>
                        <td className="ops-num">{money(m.unit_cost_cents)}</td>
                        <td className="text-muted">{m.suppliers?.name ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <AddMaterial suppliers={sups} />
        <AdjustStock materials={materials} />
      </div>

      <Reveal>
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-d-lg font-black leading-none">Produs finit</h2>
            <StripeBand color="var(--sp-green)" height={6} thin className="hidden flex-1 sm:block" />
          </div>

          <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
            <table className="ops-table">
              <thead>
                <tr>
                  <th colSpan={2}>Parfum</th>
                  <th className="ops-num">În stoc</th>
                  <th className="ops-num">Cost</th>
                  <th className="ops-num">Preț</th>
                  <th className="ops-num">Marjă</th>
                  <th className="ops-num">%</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => {
                  const hasBom = (c.line_count ?? 0) > 0;
                  return (
                    <tr key={c.id}>
                      <td className="w-1 pr-0">
                        <span
                          className="ops-swatch"
                          style={{ ["--swatch" as string]: c.accent ?? "var(--sp-line)" }}
                        />
                      </td>
                      <td>
                        <span className="font-sans">{c.name}</span>
                        <span className="ml-2 font-sans text-xs text-muted">{c.key}</span>
                      </td>
                      <td className="ops-num font-bold">{qty(c.on_hand ?? 0, "buc")}</td>
                      <td className="ops-num">
                        {hasBom ? money(c.cost_cents) : <span className="text-muted">fără rețetă</span>}
                      </td>
                      <td className="ops-num">{money(c.price_cents)}</td>
                      <td className="ops-num">{hasBom ? money(c.margin_cents) : "—"}</td>
                      <td className="ops-num font-bold">
                        {hasBom ? marginPct(c.price_cents, num(c.margin_cents)) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 font-sans text-xs leading-relaxed text-muted">
            Costul e calculat din rețeta de acum și prețurile de acum ale materialelor.
            Nu e ce a costat o șarjă anume — aia își păstrează propriul cost, înghețat
            la momentul producției.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
