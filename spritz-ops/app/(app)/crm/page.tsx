import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHead from "@/components/PageHead";
import Empty from "@/components/Empty";
import { StripeBand } from "@/components/ui/vandal";
import { companies, contacts, deals, deal, pipeline, activitiesFor } from "@/lib/queries";
import {
  money, date, stageLabel, companyTypeLabel, kindActivityLabel,
  DEAL_STAGES, daysOverdue,
} from "@/lib/format";
import { prettyPhone } from "@/lib/phone";
import { AddCompany, AddContact, AddDeal, StageMover, NextStep, AddActivity } from "./Forms";

export const dynamic = "force-dynamic";

const STAGE_COLOR: Record<string, string> = {
  lead: "var(--sp-line)",
  qualified: "var(--sp-blue)",
  quoted: "var(--sp-yellow)",
  won: "var(--sp-green)",
  lost: "var(--sp-red)",
};

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string }>;
}) {
  const { deal: openDeal } = await searchParams;

  const [comps, cons, allDeals, stages] = await Promise.all([
    companies(), contacts(), deals(), pipeline(),
  ]);

  const selected = openDeal ? await deal(openDeal) : null;
  const activities = selected ? await activitiesFor(selected.id) : [];
  const dealContacts = selected
    ? cons.filter((c) => c.company_id === selected.company_id)
    : [];

  const open = allDeals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const overdue = open.filter((d) => (daysOverdue(d.next_step_at) ?? -1) > 0);

  const byStage = new Map(stages.map((s) => [s.stage, s]));

  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="CRM"
        title="Cine cumpără en-gros"
        note={overdue.length > 0 ? `${overdue.length} în întârziere` : undefined}
      />

      <Reveal>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {DEAL_STAGES.map((s) => {
            const row = byStage.get(s.value);
            return (
              <article
                key={s.value}
                className={`border-2 border-ink bg-paper p-4 shadow-hard-sm ${s.open ? "" : "opacity-80"}`}
              >
                <div className="h-1.5 w-10" style={{ background: STAGE_COLOR[s.value] }} />
                <p className="mt-3 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
                  {s.label}
                </p>
                <p className="mt-1 font-serif text-d-lg font-black leading-none tabular-nums">
                  {row?.deals ?? 0}
                </p>
                <p className="mt-1 font-sans text-xs text-muted">{money(row?.value_cents ?? 0)}</p>
              </article>
            );
          })}
        </div>
      </Reveal>

      {overdue.length > 0 && (
        <Reveal>
          <section className="border-2 border-red bg-paper p-5 shadow-hard-sm">
            <h2 className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-red">
              Pași depășiți
            </h2>
            <ul className="mt-3 space-y-1">
              {overdue.map((d) => (
                <li key={d.id} className="font-sans text-sm">
                  <Link href={`/crm?deal=${d.id}`} className="font-bold underline decoration-2 underline-offset-4 hover:text-red">
                    {d.companies?.name}
                  </Link>{" "}
                  — {d.next_step}{" "}
                  <span className="text-muted">
                    (de {daysOverdue(d.next_step_at)} zile)
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-d-lg font-black leading-none">Oportunități</h2>
            <StripeBand color="var(--sp-blue)" height={6} thin className="hidden flex-1 sm:block" />
          </div>

          {allDeals.length === 0 ? (
            <Empty>
              Nicio oportunitate. Adaugi o companie, apoi o oportunitate, apoi notezi
              fiecare discuție pe ea. Asta e tot CRM-ul.
            </Empty>
          ) : (
            <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th colSpan={2}>Client</th>
                    <th>Despre</th>
                    <th>Stadiu</th>
                    <th className="ops-num">Valoare</th>
                    <th>Următorul pas</th>
                  </tr>
                </thead>
                <tbody>
                  {allDeals.map((d) => {
                    const late = (daysOverdue(d.next_step_at) ?? -1) > 0;
                    return (
                      <tr key={d.id}>
                        <td className="w-1 pr-0">
                          <span
                            className="ops-swatch"
                            style={{ ["--swatch" as string]: STAGE_COLOR[d.stage] }}
                          />
                        </td>
                        <td>
                          <Link
                            href={`/crm?deal=${d.id}`}
                            className="font-bold underline decoration-2 underline-offset-4 hover:text-red"
                          >
                            {d.companies?.name}
                          </Link>
                          {d.companies?.city && (
                            <span className="ml-2 font-sans text-xs text-muted">{d.companies.city}</span>
                          )}
                        </td>
                        <td>{d.title}</td>
                        <td className="font-sans text-xs uppercase tracking-wide">{stageLabel(d.stage)}</td>
                        <td className="ops-num font-bold">{money(d.value_cents)}</td>
                        <td className={late ? "font-bold text-red" : "text-muted"}>
                          {d.next_step ? `${d.next_step} · ${date(d.next_step_at)}` : "—"}
                        </td>
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
              <div>
                <h2 className="font-serif text-d-lg font-black leading-none">
                  {selected.companies?.name}
                </h2>
                <p className="mt-1 font-sans text-sm text-muted">
                  {selected.title} · {money(selected.value_cents)} ·{" "}
                  {stageLabel(selected.stage)}
                  {selected.closed_at && ` · închisă ${date(selected.closed_at)}`}
                </p>
              </div>
              <Link
                href="/crm"
                className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted hover:text-red"
              >
                Închide
              </Link>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <StageMover deal={selected} />
                <NextStep deal={selected} />
                <div className="border-t-2 border-line pt-5">
                  <h3 className="mb-3 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
                    Adaugă în istoric
                  </h3>
                  <AddActivity dealId={selected.id} contacts={dealContacts} />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
                  Istoric
                </h3>
                {activities.length === 0 ? (
                  <p className="font-sans text-sm text-muted">
                    Nimic notat încă. Ce nu e scris aici nu s-a întâmplat.
                  </p>
                ) : (
                  <ol className="space-y-4 border-l-2 border-line pl-5">
                    {activities.map((a) => (
                      <li key={a.id} className="relative">
                        <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-paper" />
                        <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted">
                          {kindActivityLabel(a.kind)} · {date(a.at)}
                          {a.contacts?.name && ` · ${a.contacts.name}`}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {a.body}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <AddCompany />
        <AddContact companies={comps} />
        <AddDeal companies={comps} />
      </div>

      <Reveal>
        <section className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 font-serif text-d-lg font-black leading-none">Companii</h2>
            {comps.length === 0 ? (
              <Empty>Nicio companie încă.</Empty>
            ) : (
              <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
                <table className="ops-table">
                  <thead>
                    <tr><th>Nume</th><th>Tip</th><th>Oraș</th></tr>
                  </thead>
                  <tbody>
                    {comps.map((c) => (
                      <tr key={c.id}>
                        <td className="font-bold">{c.name}</td>
                        <td className="font-sans text-xs uppercase tracking-wide text-muted">
                          {companyTypeLabel(c.type)}
                        </td>
                        <td className="text-muted">{c.city ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 font-serif text-d-lg font-black leading-none">Contacte</h2>
            {cons.length === 0 ? (
              <Empty>Niciun contact încă.</Empty>
            ) : (
              <div className="overflow-x-auto border-2 border-ink bg-paper shadow-hard-sm">
                <table className="ops-table">
                  <thead>
                    <tr><th>Nume</th><th>Companie</th><th>Telefon</th></tr>
                  </thead>
                  <tbody>
                    {cons.map((c) => (
                      <tr key={c.id}>
                        <td className="font-bold">{c.name}</td>
                        <td className="text-muted">{c.companies?.name ?? "—"}</td>
                        <td className="font-sans text-xs">{prettyPhone(c.phone)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
