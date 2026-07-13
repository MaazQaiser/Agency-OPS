/** Agency OS — financial display detection for premium value styling. */
export function isFinancialDisplayValue(label: string, value: string): boolean {
  if (/\$/.test(value)) return true;
  return /\b(premium|revenue|commission|broker\s*fee|written|pipeline value|total|amount|fee)\b/i.test(
    label,
  );
}
