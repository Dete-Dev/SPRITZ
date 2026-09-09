"use client";

import { useActionState } from "react";
import { Field, Select, Submit, FormMessage, Panel } from "@/components/Form";
import { addSupplier, createPurchaseOrder, addLine, receive, type Result } from "./actions";
import type { MaterialWithStock, Supplier } from "@/lib/types";

export function AddSupplier() {
  const [state, action] = useActionState<Result | null, FormData>(addSupplier, null);
  return (
    <Panel title="Furnizor nou">
      <form action={action} className="space-y-4">
        <Field label="Nume" name="name" required placeholder="Sticlărie Bucureşti SRL" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" />
          <Field label="Telefon" name="phone" />
        </div>
        <Field label="Termen de livrare (zile)" name="lead_time_days" placeholder="21" />
        <div className="flex items-center gap-4">
          <Submit>Adaugă</Submit>
          <FormMessage state={state} />
        </div>
      </form>
    </Panel>
  );
}

export function NewOrder({ suppliers }: { suppliers: Supplier[] }) {
  const [state, action] = useActionState<Result | null, FormData>(createPurchaseOrder, null);
  return (
    <Panel title="Comandă nouă" tone="quiet">
      {suppliers.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Adaugă întâi un furnizor. O comandă fără furnizor nu are de la cine să vină.
        </p>
      ) : (
        <form action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cod" name="code" required placeholder="AP-2608-01" />
            <Field label="Livrare estimată" name="expected_at" type="date" />
          </div>
          <Select
            label="Furnizor" name="supplier_id" required placeholder="alege…"
            options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Field label="Notă" name="note" />
          <div className="flex items-center gap-4">
            <Submit>Creează</Submit>
            <FormMessage state={state} />
          </div>
        </form>
      )}
    </Panel>
  );
}

export function AddLine({ poId, materials }: { poId: string; materials: MaterialWithStock[] }) {
  const [state, action] = useActionState<Result | null, FormData>(addLine, null);
  return (
    <form action={action} className="mt-5 grid items-end gap-4 sm:grid-cols-[2fr_1fr_1fr_auto]">
      <input type="hidden" name="purchase_order_id" value={poId} />
      <Select
        label="Material" name="material_id" required placeholder="alege…"
        options={materials.map((m) => ({ value: m.id, label: `${m.code} — ${m.name} (${m.unit})` }))}
      />
      <Field label="Cantitate" name="qty" required placeholder="500" />
      <Field label="Cost / unit. (cenți)" name="unit_cost_cents" required placeholder="120" />
      <div className="pb-1">
        <Submit>Adaugă linia</Submit>
      </div>
      <div className="sm:col-span-4">
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function ReceiveButton({ poId }: { poId: string }) {
  const [state, action] = useActionState<Result | null, FormData>(receive, null);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="purchase_order_id" value={poId} />
      <Submit>Recepționează</Submit>
      {state?.ok === false && (
        <p role="alert" className="font-sans text-sm font-bold text-red">{state.error}</p>
      )}
      {state?.ok === true && (
        <p role="status" className="font-sans text-sm font-bold text-green">{state.message}</p>
      )}
    </form>
  );
}
