/**
 * Phone numbers, normalised to E.164.
 *
 * Why bother: the platform deduplicates a person on email first, then phone.
 * "0722 123 456", "+40 722 123 456" and "0040722123456" are one person, and
 * stored raw they are three. Normalising on the way in is the only cheap
 * moment to fix that — after a thousand rows it is a migration.
 *
 * Romanian numbers are the default because that is who calls. An explicit
 * international prefix is kept as given.
 */

/** E.164 (like "+40722123456"), or null when the input is not a phone number. */
export function toE164(raw: string, defaultCountry = "40"): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const plus = trimmed.startsWith("+");
  // Keep only digits; spaces, dots, dashes, brackets and the "/" some people
  // type between a landline and a mobile all mean nothing here.
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (plus) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }

  // 00 is the other way of writing +.
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }

  // National form: a single leading 0 stands in for the country code.
  if (digits.startsWith("0")) {
    const national = digits.slice(1);
    if (national.length < 8 || national.length > 12) return null;
    return `+${defaultCountry}${national}`;
  }

  // Already carries the country code, without + or 00.
  if (digits.startsWith(defaultCountry) && digits.length >= 10) {
    return `+${digits}`;
  }

  // A bare national number: "722123456".
  if (digits.length >= 8 && digits.length <= 12) {
    return `+${defaultCountry}${digits}`;
  }

  return null;
}

/** "+40722123456" → "+40 722 123 456". Display only; never store this. */
export function prettyPhone(e164: string | null | undefined): string {
  if (!e164) return "—";
  const m = /^\+40(\d{3})(\d{3})(\d{3})$/.exec(e164);
  return m ? `+40 ${m[1]} ${m[2]} ${m[3]}` : e164;
}
