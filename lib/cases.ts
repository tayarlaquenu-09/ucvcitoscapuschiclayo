import type { CasoBandeja } from "./types";

/**
 * Casos ficticios para la bandeja del personal de salud mental.
 * No corresponden a personas reales.
 */
export const CASOS_FICTICIOS: CasoBandeja[] = [
  {
    id: "c-001",
    alias: "Caso Estudiante A",
    fecha: "2026-10-08T21:40:00",
    nivelRiesgo: 5,
    patrones: ["Desesperanza", "Aislamiento"],
    resumen:
      "Refiere sentirse sin salida y sin nadie con quien hablar desde hace semanas. Menciona pensamientos de no querer seguir.",
  },
  {
    id: "c-002",
    alias: "Caso Estudiante B",
    fecha: "2026-10-09T08:15:00",
    nivelRiesgo: 3,
    patrones: ["Fatiga"],
    resumen:
      "Duerme poco por las noches de estudio y se siente agotado en clase. Aún mantiene rutinas básicas.",
  },
  {
    id: "c-003",
    alias: "Caso Estudiante C",
    fecha: "2026-10-07T14:05:00",
    nivelRiesgo: 4,
    patrones: ["Aislamiento", "Fatiga"],
    resumen:
      "Dejó de asistir a reuniones de grupo y evita a sus compañeros. Describe cansancio constante y falta de motivación.",
  },
  {
    id: "c-004",
    alias: "Caso Estudiante D",
    fecha: "2026-10-09T10:30:00",
    nivelRiesgo: 2,
    patrones: ["Fatiga"],
    resumen:
      "Estrés moderado por entregas acumuladas. Busca orientación para organizar su tiempo y descansar mejor.",
  },
  {
    id: "c-005",
    alias: "Caso Estudiante E",
    fecha: "2026-10-06T19:20:00",
    nivelRiesgo: 4,
    patrones: ["Desesperanza"],
    resumen:
      "Expresa que nada mejorará y que siente que no tiene valor para su familia. Tono de tristeza persistente.",
  },
  {
    id: "c-006",
    alias: "Caso Estudiante F",
    fecha: "2026-10-09T12:00:00",
    nivelRiesgo: 1,
    patrones: [],
    resumen:
      "Se siente bien en general. Escribió para registrar un día de buen ánimo tras una semana de exámenes.",
  },
];
