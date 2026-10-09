"use client";

import { useState } from "react";
import { TextEntry } from "@/components/TextEntry";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { AudioPlayer, type Pista } from "@/components/AudioPlayer";
import { EmotionCard } from "@/components/EmotionCard";
import { MessageCards } from "@/components/MessageCards";
import type { AnalisisEmocional } from "@/lib/types";

const MAX_TEXTO = 4000;

/** Pistas de fondo. Coloca los archivos en public/audio con estos nombres. */
const PISTAS: Pista[] = [
  { titulo: "Lluvia suave", src: "/audio/lluvia.mp3" },
  { titulo: "Olas del mar", src: "/audio/olas.mp3" },
  { titulo: "Piano tranquilo", src: "/audio/piano.mp3" },
];

export default function Home() {
  const [texto, setTexto] = useState("");
  const [audio, setAudio] = useState<Blob | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [analisis, setAnalisis] = useState<AnalisisEmocional | null>(null);

  async function transcribir(blob: Blob): Promise<string> {
    const formulario = new FormData();
    formulario.append("audio", blob, "nota.webm");
    const respuesta = await fetch("/api/transcribe", { method: "POST", body: formulario });
    if (respuesta.status === 501) {
      setAviso("La nota de voz se guardó, pero la transcripción no está configurada.");
      return "";
    }
    if (!respuesta.ok) {
      setAviso("No pudimos transcribir la nota de voz. Se analizará solo el texto.");
      return "";
    }
    const datos = (await respuesta.json()) as { texto?: string };
    return datos.texto ?? "";
  }

  async function analizar() {
    setError(null);
    setAviso(null);
    setCargando(true);
    try {
      let contenido = texto.trim();
      if (audio) {
        const transcrito = await transcribir(audio);
        contenido = [contenido, transcrito].filter(Boolean).join("\n");
      }
      if (!contenido) {
        setError("Escribe cómo te sientes o graba una nota de voz.");
        return;
      }

      const respuesta = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ texto: contenido }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        setError(datos.error ?? "No se pudo analizar tu mensaje.");
        return;
      }
      setAnalisis(datos as AnalisisEmocional);
    } catch {
      setError("Hubo un problema de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Tu espacio de calma</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Escribe o graba cómo te sientes. Te devolveremos un mensaje de apoyo y un ejercicio breve.
        </p>
      </header>

      <TextEntry valor={texto} onCambio={setTexto} maximo={MAX_TEXTO} />

      <VoiceRecorder onGrabacion={setAudio} />

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={analizar}
          disabled={cargando}
          className="rounded-full bg-indigo-500 px-8 py-3 font-semibold text-white shadow transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? "Analizando…" : "Quiero apoyo"}
        </button>
        {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
        {aviso && <p className="text-sm text-amber-700 dark:text-amber-300">{aviso}</p>}
      </div>

      {analisis && (
        <div className="flex flex-col gap-6">
          <EmotionCard analisis={analisis} />
          <MessageCards tarjetas={analisis.tarjetas} />
        </div>
      )}

      <AudioPlayer pistas={PISTAS} />

      <footer className="mt-4 rounded-2xl bg-white/60 p-4 text-center text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
        Esta herramienta no reemplaza la atención profesional. Si estás en peligro, llama al
        <strong> 113 (opción 5)</strong> o acude al servicio de emergencias más cercano.
      </footer>
    </main>
  );
}
