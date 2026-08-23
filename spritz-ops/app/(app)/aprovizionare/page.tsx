import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/PageHead";
import Empty from "@/components/Empty";
import { StripeBand } from "@/components/ui/vandal";
import { suppliers, purchaseOrders, materialsWithStock, poLines } from "@/lib/queries";
import { money, qty, date, num } from "@/lib/format";
import { AddSupplier, NewOrder, AddLine, ReceiveButton } from "./Forms";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; className: string }> = {
  draft:     { label: "ciornă",      className: "bg-paper-2 text-muted" },
  sent:      { label: "trimisă",     className: "bg-yellow text-ink" },
  received:  { label: "recepționată", className: "bg-green text-paper" },
  cancelled: { label: "anulată",     className: "bg-line text-muted line-through" },
};

export default async function AprovizionarePage({
  searchParams,
}: {
  searchParams: Promise<{ po?: string }>;
}) {
  const { po: openPo } = await searchParams;

  const [sups, orders, materials] = await Promise.all([
    suppliers(), purchaseOrders(), materialsWithStock(),
  ]);

  const selected = openPo ? orders.find((o) => o.id === openPo) : undefined;
  const lines = selected ? await poLines(selected.id) : [];
  const total = lines.reduce((s, l) => s + num(l.qty) * num(l.unit_cost_cents), 0);

  const low = materials.filter((m) => m.on_hand < num(m.reorder_point));

  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="Aprovizionare"
        title="Furnizori și comenzi"
        note={low.length > 0 ? `${low.length} de comandat` : undefined}
      />

      {low.length > 0 && (
        <Reveal>
          <section className="border-2 border-red bg-paper p-5 shadow-hard-sm">
            <h2 className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-red">
              Sub prag
            </h2>
            <ul className="mt-3 space-y-1">
              {low.map((m) => (
                <li key={m.id} className="font-sans text-sm">
                  <span className="font-bold">{m.code}</span> {m.name} — are{" "}
                  {qty(m.on_hand, m.unit)}, pragul e {qty(m.reorder_point, m.unit)}
                  {m.suppliers?.name && <span className="text-muted"> · {m.suppliers.name}</span>}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <AddSupplier />
        <NewOrder suppliers={sups} />
      </div>

      <Reveal>
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-d-lg font-black leading-none">Comenzi</h2>
            <StripeBand color="var(--sp-blue)" height={6} thin className="hidden flex-1 sm:block" />
          </div>

          {orders.length === 0 ? (
            <Empty>
              Nicio comandă. Creezi una mai sus, îi adaugi liniile, apoi o recepționezi —
              recepția e ce crește stocul.
            </Empty>
          ) : (
            <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Cod</th>
                    <th>Furnizor</th>
                    <th>Stare</th>
                    <th>Estimat</th>
                    <th>Recepționat</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const s = STATUS[o.status] ?? { label: o.status, className: "" };
                    return (
                      <tr key={o.id}>
                        <td>
                          <Link
                            href={`/aprovizionare?po=${o.id}`}
                            className="font-sans text-xs font-bold tracking-wide underline decoration-2 underline-offset-4 hover:text-red"
                          >
                            {o.code}
                          </Link>
                        </td>
                        <td>{o.suppliers?.name}</td>
                        <td>
                          <span className={`inline-block rounded-full px-3 py-1 font-sans text-[0.625rem] font-bold uppercase tracking-[0.12em] ${s.className}`}>
                            {s.label}
                          </span>
                        </td>
                        <td className="text-muted">{date(o.expected_at)}</td>
                        <td className="text-muted">{date(o.received_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Reveal>

      {selected && (
        <Reveal>
          <section className="border-2 border-ink bg-paper p-5 shadow-hard-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-serif text-d-lg font-black leading-none">
                {selected.code}
                <span className="ml-3 font-sans text-sm font-normal text-muted">
                  {selected.suppliers?.name}
                </span>
              </h2>
              <Link
                href="/aprovizionare"
                className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted hover:text-red"
              >
                Închide
              </Link>
            </div>

            {lines.length === 0 ? (
              <p className="mt-4 font-sans text-sm text-muted">Nicio linie încă.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th className="ops-num">Cantitate</th>
                      <th className="ops-num">Cost / unit.</th>
                      <th className="ops-num">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <span className="font-sans text-xs font-bold tracking-wide">
                            {l.materials?.code}
                          </span>
                          <span className="ml-2">{l.materials?.name}</span>
                        </td>
                        <td className="ops-num">{qty(l.qty, l.materials?.unit)}</td>
                        <td className="ops-num">{money(l.unit_cost_cents)}</td>
                        <td className="ops-num font-bold">
                          {money(num(l.qty) * num(l.unit_cost_cents))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="font-sans text-xs font-bold uppercase tracking-[0.14em]">
                        Total
                      </td>
                      <td className="ops-num font-bold">{money(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {selected.status === "received" ? (
              <p className="mt-5 font-sans text-sm text-muted">
                Recepționată pe {date(selected.received_at)}. Liniile au intrat deja în
                registru — o a doua recepție e refuzată.
              </p>
            ) : selected.status === "cancelled" ? (
              <p className="mt-5 font-sans text-sm text-muted">Comandă anulată.</p>
            ) : (
              <>
                <AddLine poId={selected.id} materials={materials} />
                <div className="mt-6 border-t-2 border-line pt-5">
                  <ReceiveButton poId={selected.id} />
                  <p className="mt-2 max-w-prose font-sans text-xs leading-relaxed text-muted">
                    Recepția adaugă fiecare linie pe stoc și face din prețul plătit
                    costul standard al materialului. Șarjele deja produse își păstrează
                    costul lor — nimic din trecut nu se mișcă.
                  </p>
                </div>
              </>
            )}
          </section>
        </Reveal>
      )}
    </div>
  );
}
