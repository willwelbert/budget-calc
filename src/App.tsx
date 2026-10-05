import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

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

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Budget Calc</h1>
      <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
    </main>
  );
}

export default App;
