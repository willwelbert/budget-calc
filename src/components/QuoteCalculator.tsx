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
import { useState } from "react";
import { EngagementCalculator } from "./EngagementCalculator";
import { Deliverables } from "./Deliverables";

export function QuoteCalculator() {
  const [engagementRate, setEngagementRate] = useState(0);
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
      <Card className="w-full rounded-3xl bg-linear-160/srgb from-login-foreground/5.5 via-login-foreground/1.5 via-45% to-transparent ring-border shadow-[inset_0_1px_0_color-mix(in_srgb,var(--login-foreground)_6%,transparent),0_40px_90px_-40px_#040e10cc] backdrop-blur-[18px]">
        <CardHeader>
          <Select>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Selecione um nicho" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {NICHE_OPTIONS.map((niche) => (
                  <SelectItem key={niche.value} value={niche.value}>
                    {niche.label}
                  </SelectItem>
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
                  <DrawerTitle>Taxa de Engajamento</DrawerTitle>
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
        <div className="flex items-center gap-3 px-(--card-spacing)">
          <span className="h-px flex-1 bg-foreground/10" />
          <span className="eyebrow">Cotação</span>
          <span className="h-px flex-1 bg-foreground/10" />
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <h3 className="eyebrow col-span-2">Direitos</h3>

            {direitos.map((direito) => (
              <div key={direito.id} className="flex items-center space-x-2">
                <Switch id={direito.id} />
                <Label htmlFor={direito.id}>{direito.label}</Label>
              </div>
            ))}

            <div className="border border-dotted border-black bg-cream col-span-2">
              <h3 className="eyebrow">Entregáveis</h3>
            </div>
            <Deliverables />
          </div>
        </CardContent>
        <CardFooter className="bg-cream text-primary-foreground">
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
