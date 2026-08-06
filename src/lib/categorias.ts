export const CATEGORIAS = [
  "Comida",
  "Transporte",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Otros",
];

const ICONOS: Record<string, string> = {
  Comida: "🍔",
  Transporte: "🚌",
  Servicios: "💡",
  Entretenimiento: "🎬",
  Salud: "💊",
  Otros: "📦",
};

const ESTILOS: Record<string, string> = {
  Comida: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  Transporte: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  Servicios: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400",
  Entretenimiento: "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-400",
  Salud: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  Otros: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-400",
};

export function iconoDeCategoria(categoria: string) {
  return ICONOS[categoria] ?? "🏷️";
}

export function estiloDeCategoria(categoria: string) {
  return ESTILOS[categoria] ?? ESTILOS.Otros;
}
