import type { ProfileData, QuotationFormData, QuotationPayload } from "../types";

// Accepts pt-BR decimal commas ("4,5") and treats empty input as 0.
export function parseNumericInput(value: string): number {
  const normalized = value.trim().replace(",", ".");
  return normalized === "" ? 0 : Number(normalized);
}

export function adaptFormToQuotationPayload(
  form: QuotationFormData,
): QuotationPayload {
  return {
    niche: form.niche,
    engagementRate: parseNumericInput(form.engagementRate) / 100,

    youtubeSubscribers: parseNumericInput(form.youtubeSubscribers),
    instagramFollowers: parseNumericInput(form.instagramFollowers),
    tiktokFollowers: parseNumericInput(form.tiktokFollowers),
    estimatedTiktokViews: parseNumericInput(form.estimatedTiktokViews),

    includesTiktokVideo: form.includesTiktokVideo,
    includesReelsCombo: form.includesReelsCombo,
    includesEvent: form.includesEvent,
    includesImageRights: form.includesImageRights,
    includesBoostRights: form.includesBoostRights,
  };
}

export function adaptProfileToForm(
  profile: ProfileData,
): Partial<QuotationFormData> {
  return {
    niche: profile.niche,
    // Round away float noise from fraction → percentage (0.07 * 100 = 7.000000000000001)
    engagementRate: String(Number((profile.engagementRate * 100).toFixed(2))),

    youtubeSubscribers: String(profile.followers.youtube),
    instagramFollowers: String(profile.followers.instagram),
    tiktokFollowers: String(profile.followers.tiktok),
    estimatedTiktokViews: String(profile.views.tiktok),
  };
}
