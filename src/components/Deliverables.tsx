import { useState, type ComponentType } from "react";
import { Sticker } from "./Sticker";
import { InstagramIcon } from "./icons/InstagramIcon";
import { TikTokIcon } from "./icons/TikTokIcon";
import { TicketIcon } from "./icons/TicketIcon";
import type { QuotationPayload } from "../utils/types";

type Deliverables = Pick<
  QuotationPayload,
  "includesEvent" | "includesReelsCombo" | "includesTiktokVideo"
>;

type Entregavel = {
  id: keyof Deliverables;
  label: string;
  icon: ComponentType<{ className?: string }>;
  rotate: number;
};

const entregaveis: Entregavel[] = [
  {
    id: "includesEvent",
    label: "Evento presencial",
    icon: TicketIcon,
    rotate: -4,
  },
  {
    id: "includesReelsCombo",
    label: "Reels/Stories",
    icon: InstagramIcon,
    rotate: 3,
  },
  {
    id: "includesTiktokVideo",
    label: "TikTok",
    icon: TikTokIcon,
    rotate: -2,
  },
];
export function Deliverables() {
  const [deliverables, setDeliverables] = useState<Deliverables>({
    includesEvent: false,
    includesReelsCombo: false,
    includesTiktokVideo: false,
  });
  return (
    <div className="col-span-2 grid grid-cols-3 gap-4">
      {entregaveis.map((entregavel) => (
        <Sticker
          key={entregavel.id}
          id={entregavel.id}
          label={entregavel.label}
          icon={entregavel.icon}
          rotate={entregavel.rotate}
          checked={deliverables[entregavel.id]}
          onCheckedChange={(checked) =>
            setDeliverables((prev) => ({
              ...prev,
              [entregavel.id]: checked,
            }))
          }
        />
      ))}
    </div>
  );
}
