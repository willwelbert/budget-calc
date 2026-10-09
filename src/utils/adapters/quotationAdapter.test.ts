import {
  adaptFormToQuotationPayload,
  adaptProfileToForm,
  parseNumericInput,
} from "@/utils/adapters/quotationAdapter";
import { DEFAULT_QUOTATION_FORM_VALUES } from "@/utils/formSchemas";
import type { ProfileData } from "@/utils/types";

describe("parseNumericInput", () => {
  it("treats empty input as 0", () => {
    expect(parseNumericInput("")).toBe(0);
    expect(parseNumericInput("   ")).toBe(0);
  });

  it("accepts decimal commas and surrounding whitespace", () => {
    expect(parseNumericInput("4,5")).toBe(4.5);
    expect(parseNumericInput(" 1200 ")).toBe(1200);
  });

  it("returns NaN for non-numeric input", () => {
    expect(parseNumericInput("abc")).toBeNaN();
  });
});

describe("adaptFormToQuotationPayload", () => {
  it("converts string fields to numbers and the rate percentage to a fraction", () => {
    const payload = adaptFormToQuotationPayload({
      ...DEFAULT_QUOTATION_FORM_VALUES,
      niche: "beauty",
      engagementRate: "7",
      instagramFollowers: "15000",
      estimatedTiktokViews: "2500,5",
      includesEvent: true,
    });

    expect(payload).toEqual({
      niche: "beauty",
      engagementRate: 0.07,
      youtubeSubscribers: 0,
      instagramFollowers: 15000,
      tiktokFollowers: 0,
      estimatedTiktokViews: 2500.5,
      includesTiktokVideo: false,
      includesReelsCombo: false,
      includesEvent: true,
      includesImageRights: false,
      includesBoostRights: false,
    });
  });
});

describe("adaptFormToQuotationPayload rate parsing", () => {
  it("parses an ungrouped pt-BR rate above 1000%", () => {
    const payload = adaptFormToQuotationPayload({
      ...DEFAULT_QUOTATION_FORM_VALUES,
      engagementRate: "1234,5",
    });

    expect(payload.engagementRate).toBe(12.345);
  });
});

describe("adaptProfileToForm", () => {
  it("converts profile numbers to form strings and the rate fraction to a percentage", () => {
    const profile: ProfileData = {
      niche: "beauty",
      engagementRate: 0.07,
      followers: { youtube: 100, instagram: 200, tiktok: 300 },
      views: { tiktok: 400 },
    };

    expect(adaptProfileToForm(profile)).toEqual({
      niche: "beauty",
      engagementRate: "7",
      youtubeSubscribers: "100",
      instagramFollowers: "200",
      tiktokFollowers: "300",
      estimatedTiktokViews: "400",
    });
  });
});
