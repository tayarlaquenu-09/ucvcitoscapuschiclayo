import type { NivelRiesgo, Semaforo } from "./types";

/** Convierte el nivel de riesgo (1–5) en un color de semáforo. */
export function semaforoDesdeNivel(nivel: NivelRiesgo): Semaforo {
  if (nivel <= 2) return "verde";
  if (nivel === 3) return "amarillo";
  return "rojo";
}

export const ESTILO_SEMAFORO: Record<
  Semaforo,
  { etiqueta: string; fondo: string; borde: string; texto: string; punto: string }
> = {
  verde: {
    etiqueta: "Estable",
    fondo: "bg-emerald-50 dark:bg-emerald-950/40",
    borde: "border-emerald-300 dark:border-emerald-700",
    texto: "text-emerald-800 dark:text-emerald-200",
    punto: "bg-emerald-500",
  },
  amarillo: {
    etiqueta: "Atención",
    fondo: "bg-amber-50 dark:bg-amber-950/40",
    borde: "border-amber-300 dark:border-amber-700",
    texto: "text-amber-800 dark:text-amber-200",
    punto: "bg-amber-500",
  },
  rojo: {
    etiqueta: "Prioritario",
    fondo: "bg-rose-50 dark:bg-rose-950/40",
    borde: "border-rose-300 dark:border-rose-700",
    texto: "text-rose-800 dark:text-rose-200",
    punto: "bg-rose-500",
  },
};

export const ESTILO_PATRON: Record<string, string> = {
  Fatiga: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  Aislamiento: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  Desesperanza: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
};
