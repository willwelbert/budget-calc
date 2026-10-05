import { Label } from "@/components/ui/label";
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

export function QuoteCalculator() {
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
    { id: "paid-ad", label: "Autorização de conteúdo impulsionado" },
  ];

  const entregaveis = [
    { id: "in-person-event", label: "Evento presencial" },
    { id: "instagram-content", label: "Reels/Stories para a campanha?" },
    { id: "tiktok-content", label: "Videos no TikTok?" },
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
        </CardHeader>
        <CardContent>
          <div className="grid-cols-2 gap2">
            <div className="border border-dotted border-black bg-cream col-span-2">
              Direitos
            </div>

            {direitos.map((direito) => (
              <div className="flex items-center space-x-2">
                <Switch id={direito.id} />
                <Label htmlFor={direito.id}>{direito.label}</Label>
              </div>
            ))}

            <div className="border border-dotted border-black bg-cream col-span-2">
              Entregáveis
              {entregaveis.map((direito) => (
                <div className="flex items-center space-x-2">
                  <Switch id={direito.id} />
                  <Label htmlFor={direito.id}>{direito.label}</Label>
                </div>
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
