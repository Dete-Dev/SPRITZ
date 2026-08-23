"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { browserDb } from "@/lib/db.client";
import { StripeBand } from "@/components/ui/vandal";

const SECTIONS = [
  { href: "/dashboard", label: "Panou" },
  { href: "/stoc", label: "Stoc" },
  { href: "/productie", label: "Producție" },
  { href: "/aprovizionare", label: "Aprovizionare" },
  { href: "/crm", label: "CRM" },
  { href: "/rapoarte", label: "Rapoarte" },
];

export default function OpsNav({ staff }: { staff: { email: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await browserDb().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-[84rem] items-center gap-6 px-gutter py-3">
        <Link href="/dashboard" className="shrink-0 font-serif text-xl font-black leading-none tracking-tight">
          SPRITZ<span className="text-red">.</span>OPS
        </Link>

        <nav aria-label="Secțiuni" className="sp-rail flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {SECTIONS.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.06em] transition-all duration-150 ease-spritz ${
                  active
                    ? "bg-ink text-paper shadow-hard-sm"
                    : "text-muted hover:-translate-y-px hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={signOut}
          title={staff.email}
          className="shrink-0 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:text-red"
        >
          Ieși
        </button>
      </div>
      <StripeBand color="var(--sp-red)" height={4} thin />
    </header>
  );
}
