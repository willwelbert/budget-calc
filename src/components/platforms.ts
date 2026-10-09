import type { ComponentType } from "react";
import { InstagramIcon } from "./icons/InstagramIcon";
import { TikTokIcon } from "./icons/TikTokIcon";
import { YouTubeIcon } from "./icons/YouTubeIcon";
import { parseNumericInput } from "../utils/adapters/quotationAdapter";
import type { QuotationFormData } from "../utils/types";

type Platform = {
  field: keyof Pick<
    QuotationFormData,
    "instagramFollowers" | "tiktokFollowers" | "youtubeSubscribers"
  >;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

// Audience fields shown in the header and edited in the profile drawer
export const PLATFORMS: Platform[] = [
  { field: "instagramFollowers", label: "Instagram", icon: InstagramIcon },
  { field: "tiktokFollowers", label: "TikTok", icon: TikTokIcon },
  { field: "youtubeSubscribers", label: "YouTube", icon: YouTubeIcon },
];

export const PLATFORM_FIELDS = PLATFORMS.map((platform) => platform.field);

// Follower counts are optional strings; anything unparseable counts as none
export function parseFollowers(value: string) {
  const parsed = parseNumericInput(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}
