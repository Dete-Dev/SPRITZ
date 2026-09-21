/**
 * Email validation for the newsletter capture. Deliberately loose: the only
 * jobs are to reject obvious junk before it hits the log and to stop header
 * injection via newlines. Real deliverability is the ESP's problem, not ours.
 */

const MAX_LENGTH = 254; // RFC 5321 practical maximum.
const SHAPE = /^[^\s@,;:<>"']+@[^\s@.,;:<>"']+(\.[^\s@.,;:<>"']+)+$/;

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_LENGTH) return false;
  return SHAPE.test(trimmed);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
