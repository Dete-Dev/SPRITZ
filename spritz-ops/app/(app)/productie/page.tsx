import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/PageHead";
import Empty from "@/components/Empty";
import { StripeBand } from "@/components/ui/vandal";
import { skus, skuCosts, bomFor, materialsWithStock, recentBatches, movesForRef } from "@/lib/queries";
import { money, qty, date, num } from "@/lib/format";
import BomEditor from "./BomEditor";
import BatchForm from "./BatchForm";

export const dynamic = "force-dynamic";

/**
 * Recipes, bottling and lot traceability on one screen, because they are one
 * job. The selected SKU and the looked-up lot live in the URL, so a link to
 * "the recipe for cuir-tabac" is just a link.
 */
export default async function ProductiePage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string; lot?: string }>;
}) {
  const { sku: skuKey, lot } = await searchParams;

  const [all, costs, materials, batches] = await Promise.all([
    skus(), skuCosts(), materialsWithStock(), recentBatches(),
  ]);

  const selected = skuKey ? all.find((s) => s.key === skuKey) : undefined;
  const lines = selected ? await bomFor(selected.id) : [];
  const trace = lot ? await movesForRef(lot) : [];

  const withoutRecipe = costs.filter((c) => (c.line_count ?? 0) === 0).length;

  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="Producție"
        title="Rețete și șarje"
        note={withoutRecipe > 0 ? `${withoutRecipe} fără rețetă` : undefined}
      />

      <Reveal>
        <section>
          <h2 className="mb-3 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
            Alege parfumul
          </h2>
          <div className="flex flex-wrap gap-2">
            {costs.map((c) => {
              const on = c.key === skuKey;
              const has = (c.line_count ?? 0) > 0;
              return (
                <Link
                  key={c.id}
                  href={`/productie?sku=${c.key}`}
                  className={`flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-sans text-xs font-bold transition-all duration-150 ease-spritz ${
                    on ? "bg-ink text-paper shadow-hard-sm" : "bg-paper hover:-translate-y-px hover:shadow-hard-sm"
                  }`}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: c.accent ?? "var(--sp-line)" }}
                  />
                  {c.name}
                  {!has && <span className={on ? "text-yellow" : "text-red"}>·</span>}
                </Link>
              );
            })}
          </div>
          <p className="mt-2 font-sans text-xs text-muted">
            Punctul roșu înseamnă „încă nu are rețetă".
          </p>
        </section>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {selected ? (
          <BomEditor sku={selected} lines={lines} materials={materials} />
        ) : (
          <Empty>
            Alege un parfum de mai sus ca să-i vezi și să-i scrii rețeta.
          </Empty>
        )}
        <BatchForm skus={all} defaultSku={skuKey} />
      </div>

      <Reveal>
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-d-lg font-black leading-none">Șarje</h2>
            <StripeBand color="var(--sp-pink)" height={6} thin className="hidden flex-1 sm:block" />
          </div>

          {batches.length === 0 ? (
            <Empty>Nicio șarjă încă. Prima se înregistrează din formularul de sus.</Empty>
          ) : (
            <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Lot</th>
                    <th colSpan={2}>Parfum</th>
                    <th className="ops-num">Sticle</th>
                    <th className="ops-num">Cost / sticlă</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <Link
                          href={`/productie?lot=${encodeURIComponent(b.batch_code)}`}
                          className="font-sans text-xs font-bold tracking-wide underline decoration-2 underline-offset-4 hover:text-red"
                        >
                          {b.batch_code}
                        </Link>
                      </td>
                      <td className="w-1 pr-0">
                        <span
                          className="ops-swatch"
                          style={{ ["--swatch" as string]: b.skus?.accent ?? "var(--sp-line)" }}
                        />
                      </td>
                      <td>{b.skus?.name}</td>
                      <td className="ops-num font-bold">{qty(b.qty, "buc")}</td>
                      <td className="ops-num">{money(b.unit_cost_cents)}</td>
                      <td className="text-muted">{date(b.produced_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Reveal>

      {lot && (
        <Reveal>
          <section className="border-2 border-ink bg-paper p-5 shadow-hard-sm">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-d-lg font-black leading-none">
                Lot {lot}
              </h2>
              <Link
                href="/productie"
                className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted hover:text-red"
              >
                Închide
              </Link>
            </div>
            <p className="mt-2 max-w-prose font-sans text-xs leading-relaxed text-muted">
              Tot ce a atins lotul ăsta, din registru. Asta e trasabilitatea pe care o
              cere Regulamentul UE 1223/2009.
            </p>

            {trace.length === 0 ? (
              <p className="mt-4 font-sans text-sm text-muted">Niciun rând pe lotul ăsta.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>Articol</th>
                      <th className="ops-num">Mișcare</th>
                      <th>Motiv</th>
                      <th>Când</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trace.map((m) => (
                      <tr key={m.id}>
                        <td>
                          {m.item_type === "material"
                            ? `${m.materials?.code} — ${m.materials?.name}`
                            : m.skus?.name}
                        </td>
                        <td className={`ops-num font-bold ${num(m.qty) < 0 ? "text-red" : "text-green"}`}>
                          {num(m.qty) > 0 ? "+" : ""}
                          {qty(m.qty, m.item_type === "material" ? m.materials?.unit : "buc")}
                        </td>
                        <td className="font-sans text-xs uppercase tracking-wide text-muted">
                          {m.reason}
                        </td>
                        <td className="text-muted">{date(m.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </Reveal>
      )}
    </div>
  );
}
