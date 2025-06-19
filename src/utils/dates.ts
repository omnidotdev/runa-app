import * as chrono from "chrono-node";

export function parseDate(input: string): Date | null {
  if (!input.trim()) return null;

  const parsed = chrono.parseDate(input, { forwardDate: true });
  if (!parsed) return null;

  // If no time is specified, set to end of day
  if (!input.toLowerCase().includes(":")) {
    parsed.setHours(23, 59, 59, 999);
  }

  return parsed;
}
