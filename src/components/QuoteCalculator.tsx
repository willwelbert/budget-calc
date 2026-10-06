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
import { useRef } from "react";
import { Controller, FormProvider, useWatch } from "react-hook-form";
import { Separator } from "./ui/separator";
import { EngagementCalculator } from "./EngagementCalculator";
import { Deliverables } from "./Deliverables";
import { useQuotationForm } from "../hooks/useQuotationForm";
import type { QuotationFormData } from "../utils/types";

type Direito = {
  id: keyof Pick<
    QuotationFormData,
    "includesImageRights" | "includesBoostRights"
  >;
  label: string;
};

const direitos: Direito[] = [
  { id: "includesImageRights", label: "Direitos de uso de imagem" },
  {
    id: "includesBoostRights",
    label: "Autorização para conteúdo impulsionado",
  },
];

export function QuoteCalculator() {
  const { form, handleSubmit } = useQuotationForm();
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const engagementRate = useWatch({
    control: form.control,
    name: "engagementRate",
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

  return (
    <FormProvider {...form}>
      <form className="p-4 w-full" onSubmit={handleSubmit}>
        <Card className="w-full bg-linear-160/srgb from-login-foreground/5.5 via-login-foreground/1.5 via-45% to-transparent">
          <CardHeader>
            <Controller
              control={form.control}
              name="niche"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />

            <Drawer>
              <DrawerTrigger asChild>
                <Label>Taxa de Engajamento: {engagementRate || "0"}%</Label>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>
                      <h1>Taxa de Engajamento</h1>
                    </DrawerTitle>
                    <DrawerDescription>
                      Preencha ou calcule sua taxa de engajamento. <br /> Média
                      por post (últimos posts)
                    </DrawerDescription>
                  </DrawerHeader>
                  <EngagementCalculator
                    onComplete={() => saveButtonRef.current?.focus()}
                  />
                  <DrawerFooter>
                    <Button variant="secondary">Atualizar perfil</Button>
                    <Button ref={saveButtonRef}>Salvar</Button>
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
                <div key={direito.id} className="flex items-center space-x-2 ">
                  <Controller
                    control={form.control}
                    name={direito.id}
                    render={({ field }) => (
                      <Switch
                        id={direito.id}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={direito.id}>{direito.label}</Label>
                </div>
              ))}

              <div className="border border-dotted border-black bg-cream col-span-2">
                <h3 className="eyebrow">Entregáveis</h3>
              </div>
              <Deliverables />
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
      </form>
    </FormProvider>
  );
}
