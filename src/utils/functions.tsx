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

export function getEngagementRate(props: Partial<Engagement>): number {
  const likes = Number(props.likes);
  const comments = Number(props.comments);
  const shares = Number(props.shares);
  const followers = Number(props.followers);

  if (followers <= 0 || isNaN(followers)) {
    throw new Error("Precisamos de ao menos 1 seguidor");
  }

  if (isNaN(likes) || isNaN(comments) || isNaN(shares)) {
    throw new Error("Curtidas, Comentários e Shares precisam ser números");
  }

  const engagement_sum = likes + comments + shares;
  const abs_rate = engagement_sum / followers;

  const rate = abs_rate * 100;

  return rate;
}
