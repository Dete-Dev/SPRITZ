"use client";

import { useActionState } from "react";
import { Field, Select, Submit, FormMessage, Panel } from "@/components/Form";
import { saveBomLine, removeBomLine, type Result } from "./actions";
import { money, qty, num } from "@/lib/format";
import type { BomLine, MaterialWithStock, Sku } from "@/lib/types";

/**
 * The recipe for one bottle. Adding a material that is already on the recipe
 * overwrites its quantity — the primary key is (sku, material), so there is no
 * separate "edit" to build.
 */
export default function BomEditor({
  sku, lines, materials,
}: {
  sku: Sku;
  lines: BomLine[];
  materials: MaterialWithStock[];
}) {
  const [state, action] = useActionState<Result | null, FormData>(saveBomLine, null);
  const [delState, delAction] = useActionState<Result | null, FormData>(removeBomLine, null);

  const total = lines.reduce(
    (sum, l) => sum + num(l.qty_per_unit) * num(l.materials?.unit_cost_cents),
    0,
  );

  return (
    <Panel title={`Rețeta — ${sku.name}`}>
      {lines.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Nicio linie. Fără rețetă nu se poate îmbutelia: producția refuză un SKU
          care nu spune din ce e făcut.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Material</th>
                <th className="ops-num">Pe sticlă</th>
                <th className="ops-num">Cost</th>
                <th className="ops-num">În stoc</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const m = materials.find((x) => x.id === l.material_id);
                const lineCost = num(l.qty_per_unit) * num(l.materials?.unit_cost_cents);
                return (
                  <tr key={l.material_id}>
                    <td>
                      <span className="font-sans text-xs font-bold tracking-wide">
                        {l.materials?.code}
                      </span>
                      <span className="ml-2">{l.materials?.name}</span>
                    </td>
                    <td className="ops-num">{qty(l.qty_per_unit, l.materials?.unit)}</td>
                    <td className="ops-num">{money(lineCost)}</td>
                    <td className="ops-num text-muted">{qty(m?.on_hand ?? 0, m?.unit)}</td>
                    <td className="ops-num">
                      <form action={delAction}>
                        <input type="hidden" name="sku_id" value={sku.id} />
                        <input type="hidden" name="material_id" value={l.material_id} />
                        <button
                          type="submit"
                          className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-red"
                        >
                          Scoate
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="font-sans text-xs font-bold uppercase tracking-[0.14em]">
                  Cost pe sticlă
                </td>
                <td />
                <td className="ops-num font-bold">{money(total)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <form action={action} className="mt-5 grid items-end gap-4 sm:grid-cols-[2fr_1fr_auto]">
        <input type="hidden" name="sku_id" value={sku.id} />
        <Select
          label="Adaugă material" name="material_id" required placeholder="alege…"
          options={materials.map((m) => ({ value: m.id, label: `${m.code} — ${m.name} (${m.unit})` }))}
        />
        <Field label="Cantitate pe sticlă" name="qty_per_unit" required placeholder="50" />
        <div className="pb-1">
          <Submit>Salvează</Submit>
        </div>
      </form>

      <div className="mt-3">
        <FormMessage state={state} />
        <FormMessage state={delState} />
      </div>
    </Panel>
  );
}
