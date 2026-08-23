"use client";

import { useActionState } from "react";
import { Field, Select, Submit, Panel } from "@/components/Form";
import { recordBatch, type Result } from "./actions";
import type { Sku } from "@/lib/types";

/**
 * Bottling. Everything the operation needs is in the database function; this
 * only collects it and shows what came back — including the "stoc insuficient"
 * message, which names the material and both numbers.
 */
export default function BatchForm({ skus, defaultSku }: { skus: Sku[]; defaultSku?: string }) {
  const [state, action] = useActionState<Result | null, FormData>(recordBatch, null);

  return (
    <Panel title="Șarjă nouă" tone="quiet">
      <form action={action} className="space-y-4">
        <Select
          label="Parfum" name="sku_key" required placeholder="alege…"
          options={skus.map((s) => ({ value: s.key, label: s.name }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Lot" name="batch_code" required placeholder="L2608-01"
            hint="Se tipărește pe fiecare sticlă. Obligatoriu legal."
          />
          <Field label="Câte sticle" name="qty" required placeholder="100" />
        </div>
        <Field label="Notă" name="note" placeholder="opțional" />

        <div className="space-y-2">
          <Submit>Înregistrează șarja</Submit>
          {state?.ok === true && (
            <p role="status" className="font-sans text-sm font-bold text-green">
              {state.message ?? "Salvat."}
            </p>
          )}
          {state?.ok === false && (
            <p role="alert" className="font-sans text-sm font-bold leading-relaxed text-red">
              {state.error}
            </p>
          )}
        </div>

        <p className="font-sans text-xs leading-relaxed text-muted">
          Consumă materialele după rețetă și adaugă sticlele pe stoc, într-o singură
          tranzacție. Dacă un material nu ajunge, nu se întâmplă nimic — nici consumul,
          nici producția.
        </p>
      </form>
    </Panel>
  );
}
