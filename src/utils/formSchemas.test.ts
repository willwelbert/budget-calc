import {
  DEFAULT_QUOTATION_FORM_VALUES,
  quotationFormSchema,
} from "@/utils/formSchemas";

const validForm = {
  ...DEFAULT_QUOTATION_FORM_VALUES,
  niche: "beauty",
  engagementRate: "4,5",
};

describe("quotationFormSchema", () => {
  it.each(["", "10", "4,5", "0.5"])("accepts %j as a numeric field", (value) => {
    const result = quotationFormSchema.safeParse({
      ...validForm,
      instagramFollowers: value,
    });

    expect(result.success).toBe(true);
  });

  it.each(["abc", "-1"])("rejects %j as a numeric field", (value) => {
    const result = quotationFormSchema.safeParse({
      ...validForm,
      instagramFollowers: value,
    });

    expect(result.success).toBe(false);
  });

  it("requires niche and engagement rate", () => {
    const result = quotationFormSchema.safeParse(DEFAULT_QUOTATION_FORM_VALUES);

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      "niche",
      "engagementRate",
    ]);
  });
});
