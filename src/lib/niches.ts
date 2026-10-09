import {
  BookOpen,
  Brain,
  Briefcase,
  Camera,
  Car,
  Clapperboard,
  Cpu,
  Dumbbell,
  Gamepad2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Landmark,
  Leaf,
  Palette,
  PawPrint,
  PiggyBank,
  Plane,
  Shirt,
  Sofa,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react'

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

export function isNiche(value: string): value is Niche {
  return (NICHES as readonly string[]).includes(value)
}

export type NicheOption = { value: Niche; label: string }

export const NICHE_OPTIONS: NicheOption[] = NICHES.map((niche) => ({
  value: niche,
  label: niche,
}))

// Small icon per niche for condensed views. Keyed by Niche so a new niche
// without an icon fails type-checking.
export const NICHE_ICONS: Record<Niche, LucideIcon> = {
  'Saúde e Bem-estar': HeartPulse,
  'Fitness': Dumbbell,
  'Beleza e Cuidados Pessoais': Sparkles,
  'Moda e Estilo': Shirt,
  'Tecnologia': Cpu,
  'Viagens e Turismo': Plane,
  'Finanças e Investimentos': PiggyBank,
  'Negócios, Carreira e Empreendedorismo': Briefcase,
  'Educação e Aprendizado': GraduationCap,
  'Esportes': Trophy,
  'Psicologia e Desenvolvimento Pessoal': Brain,
  'Games': Gamepad2,
  'Cinema, Séries e Cultura Pop': Clapperboard,
  'Arte e Criatividade': Palette,
  'Automóveis e Mobilidade': Car,
  'Família e Parentalidade': Users,
  'Sustentabilidade e Meio Ambiente': Leaf,
  'Pets': PawPrint,
  'Fotografia e Audiovisual': Camera,
  'Livros e Literatura': BookOpen,
  'Casa, Decoração e Organização': Sofa,
  'Política e Atualidades': Landmark,
  'Religião e Espiritualidade': HandHeart,
}
