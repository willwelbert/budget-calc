import { useFormContext, useWatch } from "react-hook-form";
import { CircleDashed, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { EngagementRateDrawer } from "./EngagementRateDrawer";
import { ProfileDrawer } from "./ProfileDrawer";
import { PLATFORMS, PLATFORM_FIELDS, parseFollowers } from "./platforms";
import { NICHE_ICONS, isNiche } from "../lib/niches";
import { parseNumericInput } from "../utils/adapters/quotationAdapter";
import { formatCompact, rateFormatter } from "../utils/format";
import type { QuotationFormData } from "../utils/types";

// Both halves are full-height tap targets (siblings, never nested)
const ZONE_CLASS =
  "flex min-h-11 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50";
// Dotted underline marks a value that opens its editor when tapped
const EDITABLE_VALUE_CLASS = "underline decoration-dotted underline-offset-4";

function formatRate(rate: string) {
  const parsed = parseNumericInput(rate);
  return rate.trim() !== "" && Number.isFinite(parsed)
    ? rateFormatter.format(parsed)
    : "–";
}

// Condensed profile: tapping the left half edits niche + followers,
// the right half jumps straight to the engagement rate.
export function ProfileHeader() {
  const { control } = useFormContext<QuotationFormData>();
  const niche = useWatch({ control, name: "niche" });
  const engagementRate = useWatch({ control, name: "engagementRate" });
  const followers = useWatch({ control, name: PLATFORM_FIELDS });

  const audience = PLATFORMS.map((platform, index) => ({
    ...platform,
    count: parseFollowers(followers[index]),
  })).filter((platform) => platform.count > 0);
  const isEmpty = !niche && audience.length === 0;
  const NicheIcon = isNiche(niche) ? NICHE_ICONS[niche] : CircleDashed;
  const rate = formatRate(engagementRate);

  // The icons carry meaning only visually, so the zones spell it out
  const profileLabel = [
    "Editar perfil",
    `Nicho: ${niche || "não definido"}`,
    ...audience.map(
      (platform) =>
        `${platform.label}: ${formatCompact(platform.count)} seguidores`,
    ),
  ].join(". ");
  const rateLabel = `Taxa de engajamento: ${rate === "–" ? "não definida" : `${rate}%`}`;

  return (
    <div className="flex items-stretch gap-2">
      <ProfileDrawer>
        <button
          type="button"
          aria-label={isEmpty ? undefined : profileLabel}
          className={cn(
            ZONE_CLASS,
            "flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-left",
          )}
        >
          {isEmpty ? (
            <span className="flex items-center gap-2">
              <Pencil aria-hidden="true" className="size-3.5" />
              <span className="eyebrow">Preencha seu perfil</span>
            </span>
          ) : (
            <>
              <NicheIcon aria-hidden="true" className="size-5 shrink-0" />
              {audience.map((platform) => (
                <span
                  key={platform.field}
                  className="flex items-center gap-1.5 font-mono text-sm uppercase tabular-nums"
                >
                  <platform.icon className="size-3.5 shrink-0" />
                  <span className={EDITABLE_VALUE_CLASS}>
                    {formatCompact(platform.count)}
                  </span>
                </span>
              ))}
              {/* Niche only: no underlined values to hint that this edits */}
              {audience.length === 0 && (
                <Pencil aria-hidden="true" className="size-3.5" />
              )}
            </>
          )}
        </button>
      </ProfileDrawer>

      <Separator orientation="vertical" />

      <EngagementRateDrawer>
        <button
          type="button"
          aria-label={rateLabel}
          className={cn(
            ZONE_CLASS,
            "w-30 shrink-0 flex-col items-center justify-center gap-1 text-center",
          )}
        >
          <span className="eyebrow">Taxa de engajamento</span>
          <span
            className={cn(
              "font-mono text-lg font-bold tabular-nums",
              EDITABLE_VALUE_CLASS,
            )}
          >
            {rate}%
          </span>
        </button>
      </EngagementRateDrawer>
    </div>
  );
}
