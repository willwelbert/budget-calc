import type { MouseEvent } from "react";

// Borderless inputs: the number is the hero, focus shows as a soft tint
export const BARE_GROUP_CLASS =
  "h-auto rounded-lg border-0 bg-transparent has-[[data-slot=input-group-control]:focus-visible]:bg-muted/60 has-[[data-slot=input-group-control]:focus-visible]:ring-0";
export const BARE_INPUT_CLASS =
  "h-auto text-center font-black tabular-nums placeholder:text-muted-foreground/40";

// iOS number pads have no return key, so buttons stand in for Enter.
// Preventing mousedown keeps focus (and the keyboard) on the input.
export function keepInputFocus(evt: MouseEvent) {
  evt.preventDefault();
}
