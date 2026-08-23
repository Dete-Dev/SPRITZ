"use server";

import { revalidatePath } from "next/cache";
import { serverDb } from "@/lib/db";
import { toE164 } from "@/lib/phone";
import { COMPANY_TYPES, DEAL_STAGES, ACTIVITY_KINDS } from "@/lib/format";

export type Result = { ok: true; message?: string } | { ok: false; error: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/** "1250" or "1250,50" euros → cents. Rejects anything else. */
function euroToCents(raw: string): number | null {
  if (!raw) return 0;
  const n = Number(raw.replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export async function addCompany(_prev: Result | null, form: FormData): Promise<Result> {
  const name = str(form, "name");
  const type = str(form, "type");
  if (!name) return { ok: false, error: "Numele e obligatoriu." };
  if (!COMPANY_TYPES.some((t) => t.value === type)) return { ok: false, error: "Tip necunoscut." };

  const db = await serverDb();
  const { error } = await db.from("companies").insert({
    name,
    type,
    city: str(form, "city") || null,
    vat_id: str(form, "vat_id") || null,
    note: str(form, "note") || null,
  });

  if (error) {
    return {
      ok: false,
      error: error.code === "23505"
        ? `${name} există deja în orașul ăsta.`
        : error.message,
    };
  }
  revalidatePath("/crm");
  return { ok: true };
}

export async function addContact(_prev: Result | null, form: FormData): Promise<Result> {
  const name = str(form, "name");
  if (!name) return { ok: false, error: "Numele e obligatoriu." };

  const rawPhone = str(form, "phone");
  let phone: string | null = null;
  if (rawPhone) {
    phone = toE164(rawPhone);
    if (!phone) return { ok: false, error: `„${rawPhone}" nu arată a număr de telefon.` };
  }

  const db = await serverDb();
  const { error } = await db.from("contacts").insert({
    company_id: str(form, "company_id") || null,
    name,
    email: str(form, "email").toLowerCase() || null,
    phone,
    role: str(form, "role") || null,
  });

  if (error) {
    // The unique indexes on email and phone are the deduplication the platform
    // depends on; say which one caught it rather than "duplicate key".
    if (error.code === "23505") {
      const which = error.message.includes("phone") ? "Telefonul" : "Emailul";
      return { ok: false, error: `${which} e deja la alt contact.` };
    }
    return { ok: false, error: error.message };
  }
  revalidatePath("/crm");
  return { ok: true };
}

export async function addDeal(_prev: Result | null, form: FormData): Promise<Result> {
  const companyId = str(form, "company_id");
  const title = str(form, "title");
  if (!companyId) return { ok: false, error: "Alege compania." };
  if (!title) return { ok: false, error: "Scrie despre ce e vorba." };

  const cents = euroToCents(str(form, "value"));
  if (cents === null) return { ok: false, error: "Valoarea nu e un număr." };

  const db = await serverDb();
  const { data: { user } } = await db.auth.getUser();
  const { error } = await db.from("deals").insert({
    company_id: companyId,
    title,
    value_cents: cents,
    expected_close: str(form, "expected_close") || null,
    next_step: str(form, "next_step") || null,
    next_step_at: str(form, "next_step_at") || null,
    owner_id: user?.id ?? null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/crm");
  return { ok: true };
}

export async function moveStage(_prev: Result | null, form: FormData): Promise<Result> {
  const id = str(form, "deal_id");
  const stage = str(form, "stage");
  if (!id) return { ok: false, error: "Oportunitate necunoscută." };
  if (!DEAL_STAGES.some((s) => s.value === stage)) return { ok: false, error: "Stadiu necunoscut." };

  const reason = str(form, "lost_reason");
  if (stage === "lost" && !reason) {
    return { ok: false, error: "Scrie de ce s-a pierdut — altfel nu învățăm nimic din ea." };
  }

  const db = await serverDb();
  const { error } = await db
    .from("deals")
    .update({ stage, lost_reason: stage === "lost" ? reason : null })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/crm");
  return { ok: true };
}

export async function updateNextStep(_prev: Result | null, form: FormData): Promise<Result> {
  const id = str(form, "deal_id");
  if (!id) return { ok: false, error: "Oportunitate necunoscută." };

  const db = await serverDb();
  const { error } = await db
    .from("deals")
    .update({
      next_step: str(form, "next_step") || null,
      next_step_at: str(form, "next_step_at") || null,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/crm");
  return { ok: true };
}

export async function addActivity(_prev: Result | null, form: FormData): Promise<Result> {
  const dealId = str(form, "deal_id");
  const kind = str(form, "kind");
  const body = str(form, "body");

  if (!dealId) return { ok: false, error: "Oportunitate necunoscută." };
  if (!ACTIVITY_KINDS.some((k) => k.value === kind)) return { ok: false, error: "Tip necunoscut." };
  if (!body) return { ok: false, error: "Scrie ce s-a discutat." };

  const db = await serverDb();
  const { data: { user } } = await db.auth.getUser();
  const { error } = await db.from("activities").insert({
    deal_id: dealId,
    contact_id: str(form, "contact_id") || null,
    kind,
    body,
    created_by: user?.id ?? null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/crm");
  return { ok: true };
}
