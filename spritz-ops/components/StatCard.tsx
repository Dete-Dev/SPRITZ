/**
 * One number on the dashboard. `pending` names the phase that fills it — an
 * empty tile showing "0" would read as a real zero, which is worse than
 * admitting the wiring is not there yet.
 */
export default function StatCard({
  label,
  value,
  hint,
  pending,
}: {
  label: string;
  value?: string;
  hint?: string;
  pending?: string;
}) {
  return (
    <article className="border-2 border-ink bg-paper p-5 shadow-hard-sm">
      <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      {pending ? (
        <p className="mt-3 font-sans text-sm italic text-muted">{pending}</p>
      ) : (
        <>
          <p className="mt-2 font-serif text-d-lg font-black leading-none tabular-nums">{value}</p>
          {hint && <p className="mt-2 font-sans text-xs text-muted">{hint}</p>}
        </>
      )}
    </article>
  );
}
