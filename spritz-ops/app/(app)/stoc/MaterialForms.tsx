"use client";

import { useActionState } from "react";
import { Field, Select, Submit, FormMessage, Panel } from "@/components/Form";
import { addMaterial, adjustStock, type Result } from "./actions";
import { MATERIAL_KINDS, UNITS } from "@/lib/format";
import type { MaterialWithStock, Supplier } from "@/lib/types";

export function AddMaterial({ suppliers }: { suppliers: Supplier[] }) {
  const [state, action] = useActionState<Result | null, FormData>(addMaterial, null);

  return (
    <Panel title="Material nou">
      <form action={action} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cod" name="code" required placeholder="BTL-50" />
          <Field label="Nume" name="name" required placeholder="Sticlă 50 ml, transparentă" />
          <Select
            label="Tip" name="kind" required placeholder="alege…"
            options={MATERIAL_KINDS.map((k) => ({ value: k.value, label: k.label }))}
          />
          <Select
            label="Unitate" name="unit" required placeholder="alege…"
            options={UNITS.map((u) => ({ value: u, label: u }))}
          />
          <Field
            label="Cost / unitate (cenți)" name="unit_cost_cents" defaultValue="0"
            hint="Poate fi zecimal: 1 ml de alcool costă sub un cent."
          />
          <Field
            label="Prag de reaprovizionare" name="reorder_point" defaultValue="0"
            hint="Sub asta, materialul apare roșu."
          />
        </div>
        <Select
          label="Furnizor" name="supplier_id" placeholder="fără"
          options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
        />
        <div className="flex items-center gap-4">
          <Submit>Adaugă</Submit>
          <FormMessage state={state} />
        </div>
      </form>
    </Panel>
  );
}

export function AdjustStock({ materials }: { materials: MaterialWithStock[] }) {
  const [state, action] = useActionState<Result | null, FormData>(adjustStock, null);

  return (
    <Panel title="Ajustare de stoc" tone="quiet">
      <form action={action} className="space-y-4">
        <Select
          label="Material" name="material_id" required placeholder="alege…"
          options={materials.map((m) => ({ value: m.id, label: `${m.code} — ${m.name}` }))}
        />
        <Field
          label="Cantitate" name="qty" required placeholder="+250 sau -12"
          hint="Pozitiv adaugă, negativ scade. Registrul nu se editează — se adaugă un rând."
        />
        <Field label="Motiv" name="note" required placeholder="inventar 22.08 / spart la transport" />
        <div className="flex items-center gap-4">
          <Submit>Înregistrează</Submit>
          <FormMessage state={state} />
        </div>
      </form>
    </Panel>
  );
}
