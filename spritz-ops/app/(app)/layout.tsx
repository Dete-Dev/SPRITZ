import { redirect } from "next/navigation";
import { currentStaff } from "@/lib/db";
import SmoothScroll from "@/components/SmoothScroll";
import OpsNav from "@/components/OpsNav";

/**
 * Everything inside `(app)` is staff-only. The middleware bounces visitors
 * without a session; this checks the allowlist, which is the real gate.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const staff = await currentStaff();
  if (!staff) redirect("/login");

  return (
    <>
      <SmoothScroll />
      <div className="min-h-screen bg-paper-2">
        <OpsNav staff={staff} />
        <main className="mx-auto max-w-[84rem] px-gutter py-10">{children}</main>
      </div>
    </>
  );
}
