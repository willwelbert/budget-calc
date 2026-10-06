import { formatCompact, formatCount } from "./format";

// Intl may separate the unit with a no-break space
const normalize = (text: string) => text.replace(/\s/g, " ");

describe("formatCompact", () => {
  it.each([
    [950, "950"],
    [12500, "12,5 mil"],
    [1200000, "1,2 mi"],
  ])("formats %d as %s", (value, expected) => {
    expect(normalize(formatCompact(value))).toBe(expected);
  });
});

describe("formatCount", () => {
  it("adds pt-BR thousand separators to raw digits", () => {
    expect(formatCount("12500")).toBe("12.500");
  });

  it("keeps an empty value empty", () => {
    expect(formatCount("")).toBe("");
  });
});
