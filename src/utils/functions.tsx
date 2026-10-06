import type { Engagement } from "./types";
import { parseNumericInput } from "./adapters/quotationAdapter";

// Returns the engagement rate as a percentage, or null while the inputs
// can't produce one yet (no followers, non-numeric values).
export function getEngagementRate(props: Partial<Engagement>): number | null {
  const likes = parseNumericInput(props.likes ?? "");
  const comments = parseNumericInput(props.comments ?? "");
  const shares = parseNumericInput(props.shares ?? "");
  const followers = parseNumericInput(props.followers ?? "");

  if (isNaN(followers) || followers <= 0) {
    return null;
  }

  if (isNaN(likes) || isNaN(comments) || isNaN(shares)) {
    return null;
  }

  const engagement_sum = likes + comments + shares;
  const abs_rate = engagement_sum / followers;

  const rate = abs_rate * 100;

  return rate;
}
