const countFormatter = new Intl.NumberFormat("pt-BR");
const compactFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});
// No grouping: the stored rate must stay parseable by parseNumericInput
export const rateFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
  useGrouping: false,
});

// State keeps raw digits ("12500"); only the display gets separators ("12.500")
export function formatCount(digits: string) {
  return digits ? countFormatter.format(Number(digits)) : "";
}

// Audience size for tight spots: 12500 → "12,5 mil", 1200000 → "1,2 mi"
export function formatCompact(value: number) {
  return compactFormatter.format(value);
}
