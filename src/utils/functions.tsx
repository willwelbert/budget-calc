import type { ProfileData, QuotationPayload, Engagement } from "./types";

export function getQuotationDataFromProfile(
  profile: ProfileData,
): Partial<QuotationPayload> {
  return {
    niche: profile.niche,
    engagementRate: profile.engagementRate,

    youtubeSubscribers: profile.followers.youtube,
    instagramFollowers: profile.followers.instagram,
    tiktokFollowers: profile.followers.tiktok,
    estimatedTiktokViews: profile.views.tiktok,
  };
}

export function getEngagementRate({
  likes,
  comments,
  shares,
  followers,
}: Engagement): number {
  const engagement_sum = likes + comments + shares;
  const abs_rate = engagement_sum / followers;

  const rate = abs_rate * 100;

  return rate;
}
