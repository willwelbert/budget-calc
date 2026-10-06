import type { ComponentType, CSSProperties } from "react";
import { cn } from "cn";
import { Switch as SwitchPrimitive } from "radix-ui";

type StickerProps = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Tilt (in degrees) the sticker settles at once it's stuck on. */
  rotate?: number;
  className?: string;
};

// A switch drawn as a sticker: an empty dashed slot when off,
// a sticker slapped onto the slot when on. Both directions are plain
// transitions (no keyframes): Chrome won't start a transition on a property
// a CSS animation was driving, so mixing the two skipped the peel-off.
export function Sticker({
  id,
  label,
  icon: Icon,
  checked,
  onCheckedChange,
  rotate = 0,
  className,
}: StickerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="group/sticker relative size-18 cursor-pointer rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        style={{ "--sticker-rotate": `${rotate}deg` } as CSSProperties}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center rounded-full border-4 border-dashed border-muted-foreground/50 text-muted-foreground transition-opacity duration-150 group-data-[state=checked]/sticker:opacity-0 group-data-[state=checked]/sticker:delay-100 motion-reduce:transition-none"
        >
          <Icon className="size-7 opacity-50" />
        </span>
        <SwitchPrimitive.Thumb className="absolute inset-0 grid place-items-center rounded-full bg-cream text-[#1b373c] shadow-md ring-4 ring-white outline-1 outline-offset-4 outline-[#1b373c]/20 data-checked:rotate-(--sticker-rotate) transition-[opacity,scale,rotate] data-checked:duration-[90ms,320ms,320ms] data-checked:ease-[cubic-bezier(0.34,1.56,0.64,1)] data-unchecked:scale-115 data-unchecked:rotate-[calc(var(--sticker-rotate)+8deg)] data-unchecked:opacity-0 data-unchecked:duration-150 data-unchecked:ease-in motion-reduce:transition-none">
          <Icon className="size-8" />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
      <label
        htmlFor={id}
        className="cursor-pointer text-center text-xs leading-tight"
      >
        {label}
      </label>
    </div>
  );
}
