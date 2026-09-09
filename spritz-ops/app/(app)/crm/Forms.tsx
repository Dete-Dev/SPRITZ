"use client";

import { useActionState } from "react";
import { Field, Select, Submit, FormMessage, Panel } from "@/components/Form";
import {
  addCompany, addContact, addDeal, moveStage, updateNextStep, addActivity, type Result,
} from "./actions";
import { COMPANY_TYPES, DEAL_STAGES, ACTIVITY_KINDS } from "@/lib/format";
import type { Company, Contact, Deal } from "@/lib/types";

export function AddCompany() {
  const [state, action] = useActionState<Result | null, FormData>(addCompany, null);
  return (
    <Panel title="Companie nouă">
      <form action={action} className="space-y-4">
        <Field label="Nume" name="name" required placeholder="Concept Store Cluj" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Tip" name="type" required placeholder="alege…"
            options={COMPANY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          />
          <Field label="Oraș" name="city" placeholder="Cluj-Napoca" />
        </div>
        <Field label="CUI" name="vat_id" placeholder="RO12345678" />
        <div className="flex items-center gap-4">
          <Submit>Adaugă</Submit>
          <FormMessage state={state} />
        </div>
      </form>
    </Panel>
  );
}

export function AddContact({ companies }: { companies: Company[] }) {
  const [state, action] = useActionState<Result | null, FormData>(addContact, null);
  return (
    <Panel title="Contact nou" tone="quiet">
      <form action={action} className="space-y-4">
        <Field label="Nume" name="name" required placeholder="Ioana Marin" />
        <Select
          label="Companie" name="company_id" placeholder="fără"
          options={companies.map((c) => ({ value: c.id, label: c.city ? `${c.name} — ${c.city}` : c.name }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" />
          <Field
            label="Telefon" name="phone" placeholder="0722 123 456"
            hint="Se salvează ca +40722123456, oricum îl scrii."
          />
        </div>
        <Field label="Rol" name="role" placeholder="achiziții" />
        <div className="flex items-center gap-4">
          <Submit>Adaugă</Submit>
          <FormMessage state={state} />
        </div>
      </form>
    </Panel>
  );
}

export function AddDeal({ companies }: { companies: Company[] }) {
  const [state, action] = useActionState<Result | null, FormData>(addDeal, null);
  return (
    <Panel title="Oportunitate nouă">
      {companies.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Adaugă întâi o companie. O oportunitate fără client nu e o oportunitate.
        </p>
      ) : (
        <form action={action} className="space-y-4">
          <Select
            label="Companie" name="company_id" required placeholder="alege…"
            options={companies.map((c) => ({ value: c.id, label: c.city ? `${c.name} — ${c.city}` : c.name }))}
          />
          <Field label="Despre ce e vorba" name="title" required placeholder="Listare 6 parfumuri, comandă test" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Valoare (€)" name="value" placeholder="3000" />
            <Field label="Închidere estimată" name="expected_close" type="date" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Următorul pas" name="next_step" placeholder="trimit mostre" />
            <Field label="Când" name="next_step_at" type="date" />
          </div>
          <div className="flex items-center gap-4">
            <Submit>Adaugă</Submit>
            <FormMessage state={state} />
          </div>
        </form>
      )}
    </Panel>
  );
}

export function StageMover({ deal }: { deal: Deal }) {
  const [state, action] = useActionState<Result | null, FormData>(moveStage, null);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="deal_id" value={deal.id} />
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Stadiu" name="stage" required
          options={DEAL_STAGES.map((s) => ({ value: s.value, label: s.label }))}
        />
        <Field label="Motiv, dacă e pierdută" name="lost_reason" defaultValue={deal.lost_reason ?? ""} />
        <div className="pb-1">
          <Submit>Mută</Submit>
        </div>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

export function NextStep({ deal }: { deal: Deal }) {
  const [state, action] = useActionState<Result | null, FormData>(updateNextStep, null);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="deal_id" value={deal.id} />
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Următorul pas" name="next_step" defaultValue={deal.next_step ?? ""} />
        <Field label="Când" name="next_step_at" type="date" defaultValue={deal.next_step_at ?? ""} />
        <div className="pb-1">
          <Submit>Salvează</Submit>
        </div>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

export function AddActivity({ dealId, contacts }: { dealId: string; contacts: Contact[] }) {
  const [state, action] = useActionState<Result | null, FormData>(addActivity, null);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="deal_id" value={dealId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Ce s-a întâmplat" name="kind" required placeholder="alege…"
          options={ACTIVITY_KINDS.map((k) => ({ value: k.value, label: k.label }))}
        />
        <Select
          label="Cu cine" name="contact_id" placeholder="nespecificat"
          options={contacts.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>
      <label className="block">
        <span className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
          Ce s-a discutat
        </span>
        <textarea
          name="body"
          required
          rows={3}
          className="mt-1.5 w-full border-2 border-ink bg-paper px-3 py-2 font-sans text-sm outline-none transition-colors focus:border-red"
        />
      </label>
      <div className="flex items-center gap-4">
        <Submit>Adaugă</Submit>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
