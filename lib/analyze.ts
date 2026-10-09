import type { AnalisisEmocional, NivelRiesgo, Patron, TarjetaTexto, TipoTarjeta } from "./types";
import { semaforoDesdeNivel } from "./risk";

const PATRONES_VALIDOS: Patron[] = ["Fatiga", "Aislamiento", "Desesperanza"];
const TIPOS_VALIDOS: TipoTarjeta[] = ["mensaje", "respiracion", "grounding"];

const SISTEMA = `Eres un asistente de apoyo emocional para estudiantes universitarios.
No eres un profesional de salud y no diagnosticas. Analiza el texto del estudiante y responde
SOLO con un objeto JSON válido, sin texto adicional, con esta forma exacta:
{
  "emocion": "una palabra o frase corta en español (p. ej. ansiedad, tristeza, calma)",
  "nivelRiesgo": entero del 1 al 5 (1 = bienestar, 5 = riesgo crítico),
  "patrones": lista que puede contener solo "Fatiga", "Aislamiento" y/o "Desesperanza",
  "resumen": "extracto de exactamente dos oraciones para el especialista",
  "tarjetas": [
    { "tipo": "mensaje", "titulo": "...", "contenido": ["mensaje de aliento personalizado, cálido y breve"] },
    { "tipo": "respiracion" o "grounding", "titulo": "...", "contenido": ["paso 1", "paso 2", "paso 3"] }
  ]
}
Si el nivel de riesgo es 4 o 5, el mensaje debe animar a buscar ayuda profesional inmediata.`;

/** Llama a la API de Anthropic y devuelve el análisis validado. Solo se ejecuta en el servidor. */
export async function analizarTexto(texto: string): Promise<AnalisisEmocional> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Falta ANTHROPIC_API_KEY en las variables de entorno.");
  }

  const respuesta = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 1024,
      system: SISTEMA,
      messages: [{ role: "user", content: texto }],
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`La API de IA respondió con estado ${respuesta.status}.`);
  }

  const datos = (await respuesta.json()) as { content?: { type: string; text?: string }[] };
  const bloque = datos.content?.find((c) => c.type === "text")?.text ?? "";
  const crudo = extraerJson(bloque);
  return validarAnalisis(crudo);
}

function extraerJson(texto: string): unknown {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio === -1 || fin === -1) throw new Error("La IA no devolvió JSON.");
  return JSON.parse(texto.slice(inicio, fin + 1));
}

/** Valida y normaliza la respuesta del modelo para no confiar en su forma. */
export function validarAnalisis(entrada: unknown): AnalisisEmocional {
  const o = entrada as Record<string, unknown>;

  const nivelNum = Math.min(5, Math.max(1, Math.round(Number(o.nivelRiesgo) || 1)));
  const nivelRiesgo = nivelNum as NivelRiesgo;

  const patrones = Array.isArray(o.patrones)
    ? (o.patrones.filter((p) => PATRONES_VALIDOS.includes(p as Patron)) as Patron[])
    : [];

  const tarjetas: TarjetaTexto[] = Array.isArray(o.tarjetas)
    ? o.tarjetas
        .filter((t): t is Record<string, unknown> => typeof t === "object" && t !== null)
        .filter((t) => TIPOS_VALIDOS.includes(t.tipo as TipoTarjeta))
        .map((t) => ({
          tipo: t.tipo as TipoTarjeta,
          titulo: String(t.titulo ?? ""),
          contenido: Array.isArray(t.contenido) ? t.contenido.map(String) : [],
        }))
    : [];

  return {
    emocion: String(o.emocion ?? "no identificada"),
    semaforo: semaforoDesdeNivel(nivelRiesgo),
    nivelRiesgo,
    patrones,
    resumen: String(o.resumen ?? ""),
    tarjetas,
  };
}
