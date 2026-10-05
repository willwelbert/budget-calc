export const NICHES = [
  'Saúde e Bem-estar',
  'Fitness',
  'Beleza e Cuidados Pessoais',
  'Moda e Estilo',
  'Tecnologia',
  'Viagens e Turismo',
  'Finanças e Investimentos',
  'Negócios, Carreira e Empreendedorismo',
  'Educação e Aprendizado',
  'Esportes',
  'Psicologia e Desenvolvimento Pessoal',
  'Games',
  'Cinema, Séries e Cultura Pop',
  'Arte e Criatividade',
  'Automóveis e Mobilidade',
  'Família e Parentalidade',
  'Sustentabilidade e Meio Ambiente',
  'Pets',
  'Fotografia e Audiovisual',
  'Livros e Literatura',
  'Casa, Decoração e Organização',
  'Política e Atualidades',
  'Religião e Espiritualidade',
] as const

export type Niche = (typeof NICHES)[number]

export type NicheOption = { value: Niche; label: string }

export const NICHE_OPTIONS: NicheOption[] = NICHES.map((niche) => ({
  value: niche,
  label: niche,
}))
