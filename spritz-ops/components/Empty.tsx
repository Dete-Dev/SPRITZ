/** A table with nothing in it yet. Says what to do, not just that it is empty. */
export default function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-2 border-dashed border-line bg-paper p-8 text-center">
      <p className="mx-auto max-w-prose font-sans text-sm leading-relaxed text-muted">{children}</p>
    </div>
  );
}
