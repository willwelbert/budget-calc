import { z } from "zod";
import { parseNumericInput } from "./adapters/quotationAdapter";
import type { QuotationFormData } from "./types";

const numericString = z
  .string()
  .trim()
  .refine((value) => {
    const parsed = parseNumericInput(value);
    return Number.isFinite(parsed) && parsed >= 0;
  }, "Precisa ser um número");

export const quotationFormSchema = z.object({
  niche: z.string().min(1, "Selecione um nicho"),
  engagementRate: numericString.refine(
    (value) => value !== "",
    "Informe a taxa de engajamento",
  ),

  youtubeSubscribers: numericString,
  instagramFollowers: numericString,
  tiktokFollowers: numericString,
  estimatedTiktokViews: numericString,

  includesTiktokVideo: z.boolean(),
  includesReelsCombo: z.boolean(),
  includesEvent: z.boolean(),
  includesImageRights: z.boolean(),
  includesBoostRights: z.boolean(),
}) satisfies z.ZodType<QuotationFormData>;

export const DEFAULT_QUOTATION_FORM_VALUES: QuotationFormData = {
  niche: "",
  engagementRate: "",

  youtubeSubscribers: "",
  instagramFollowers: "",
  tiktokFollowers: "",
  estimatedTiktokViews: "",

  includesTiktokVideo: false,
  includesReelsCombo: false,
  includesEvent: false,
  includesImageRights: false,
  includesBoostRights: false,
};
