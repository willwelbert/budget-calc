export type ProfileData = {
  niche: string;
  engagementRate: number; // decimal fraction: 0.07 = 7%

  followers: {
    youtube: number;
    instagram: number;
    tiktok: number;
  };
  views: {
    tiktok: number;
  };
};

export type Engagement = {
  likes: string;
  comments: string;
  shares: string;
  followers: string;
};

export type QuotationPayload = {
  niche: string;
  engagementRate: number; // decimal fraction: 0.07 = 7%

  // Audience
  youtubeSubscribers: number;
  instagramFollowers: number;
  tiktokFollowers: number;
  estimatedTiktokViews: number;

  // Deliverables / rights
  includesTiktokVideo: boolean;
  includesReelsCombo: boolean;
  includesEvent: boolean;
  includesImageRights: boolean;
  includesBoostRights: boolean;
};

// Form-side mirror of QuotationPayload: numeric fields are kept as strings
// for ease of editing and converted by adaptFormToQuotationPayload.
export type QuotationFormData = {
  niche: string;
  engagementRate: string; // percentage: "7" or "4,5" = 7% / 4.5%

  // Audience
  youtubeSubscribers: string;
  instagramFollowers: string;
  tiktokFollowers: string;
  estimatedTiktokViews: string;

  // Deliverables / rights
  includesTiktokVideo: boolean;
  includesReelsCombo: boolean;
  includesEvent: boolean;
  includesImageRights: boolean;
  includesBoostRights: boolean;
};
