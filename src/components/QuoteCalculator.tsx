import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";

import { NICHE_OPTIONS } from "../lib/niches";
import { useState, type ComponentType } from "react";
import { Separator } from "./ui/separator";
import { EngagementCalculator } from "./EngagementCalculator";
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
  { id: "includesEvent", label: "Evento presencial", icon: TicketIcon, rotate: -4 },
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

export function QuoteCalculator() {
  const [engagementRate, setEngagementRate] = useState(0);
  const [deliverables, setDeliverables] = useState<Deliverables>({
    includesEvent: false,
    includesReelsCombo: false,
    includesTiktokVideo: false,
  });
  // add form para profile info
  // form initial data é o retorno da funçao getFromProfile
  // por enquanto podemos salvar o profile no navegador
  // editar perfil:
  //   - drawer;
  //     - Seletor de nicho;
  //     - taxa abs de engajamento: OU (curtidas + comentários + compartilhamentos) / Seguidores = taxa
  //     - taxa * 100 = porcentagem
  //   - CTAs: Salvar no perfil, Usar nesta cotação,
  //
  //
  // o payload para a Quotation é formado de 2 forms
  // 1- profile info
  // 2- quotation deliverables (toggles)
  //
  //
  //seção resultados:
  //resultado primário: Valor em Reais em destaque.
  //motivação estruturada da resposta em detalhes (^) - click
  //
  //

  const quote = {
    start: 3500,
    end: 5000,
  };

  const direitos = [
    { id: "image-use", label: "Direitos de uso de imagem" },
    { id: "paid-ad", label: "Autorização para conteúdo impulsionado" },
  ];

  return (
    <div className="p-4 w-full">
      <Card className="w-full bg-linear-160/srgb from-login-foreground/5.5 via-login-foreground/1.5 via-45% to-transparent">
        <CardHeader>
          <Select>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Selecione um nicho" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {NICHE_OPTIONS.map((niche) => (
                  <SelectItem value={niche.value}>{niche.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Drawer>
            <DrawerTrigger asChild>
              <Label>Taxa de Engajamento: {engagementRate}%</Label>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>
                    <h1>Taxa de Engajamento</h1>
                  </DrawerTitle>
                  <DrawerDescription>
                    Preencha ou calcule sua taxa de engajamento
                  </DrawerDescription>
                </DrawerHeader>
                <EngagementCalculator
                  rate={engagementRate}
                  setRate={setEngagementRate}
                />
                <DrawerFooter>
                  <Button variant="secondary">Atualizar perfil</Button>
                  <Button>Salvar</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-dotted border-black bg-cream col-span-2">
              <h3 className="eyebrow">Direitos</h3>
            </div>

            {direitos.map((direito) => (
              <div className="flex items-center space-x-2 ">
                <Switch id={direito.id} />
                <Label htmlFor={direito.id}>{direito.label}</Label>
              </div>
            ))}

            <div className="border border-dotted border-black bg-cream col-span-2">
              <h3 className="eyebrow">Entregáveis</h3>
            </div>
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
          </div>
        </CardContent>
        <CardFooter className="bg-cream">
          <div className="w-full">
            <h2 className="font-semibold tracking-widest text-xl">
              R${quote.start} - R${quote.end}
            </h2>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
