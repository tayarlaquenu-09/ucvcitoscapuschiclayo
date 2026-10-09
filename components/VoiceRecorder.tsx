"use client";

import { useEffect, useRef, useState } from "react";
import { eliminarNota, guardarNota, listarNotas, type NotaVoz } from "@/lib/audioStore";

interface Props {
  /** Se llama con el audio recién grabado para poder transcribirlo. */
  onGrabacion?: (blob: Blob) => void;
}

export function VoiceRecorder({ onGrabacion }: Props) {
  const [grabando, setGrabando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notas, setNotas] = useState<NotaVoz[]>([]);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const fragmentos = useRef<Blob[]>([]);

  useEffect(() => {
    listarNotas().then(setNotas).catch(() => setNotas([]));
  }, []);

  async function iniciar() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tu navegador no permite grabar audio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      fragmentos.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) fragmentos.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(fragmentos.current, { type: recorder.mimeType || "audio/webm" });
        const nota = await guardarNota(blob);
        setNotas((prev) => [nota, ...prev].slice(0, 5));
        onGrabacion?.(blob);
      };
      recorder.start();
      mediaRef.current = recorder;
      setGrabando(true);
    } catch {
      setError("Necesitamos permiso para usar el micrófono.");
    }
  }

  function detener() {
    mediaRef.current?.stop();
    mediaRef.current = null;
    setGrabando(false);
  }

  async function borrar(id: string) {
    await eliminarNota(id);
    setNotas((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <section className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-slate-800/70">
      <h2 className="mb-3 text-lg font-semibold">Nota de voz</h2>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={grabando ? detener : iniciar}
          aria-label={grabando ? "Detener grabación" : "Iniciar grabación"}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow transition ${
            grabando ? "animate-pulse bg-rose-500" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {grabando ? "■" : "🎙"}
        </button>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {grabando ? "Grabando… toca para detener" : "Toca el micrófono para grabar"}
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {notas.length > 0 && (
        <ul className="mt-4 space-y-2">
          {notas.map((nota) => (
            <NotaItem key={nota.id} nota={nota} onBorrar={() => borrar(nota.id)} />
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Las notas se guardan en este navegador durante 24 horas (máximo 5).
      </p>
    </section>
  );
}

function NotaItem({ nota, onBorrar }: { nota: NotaVoz; onBorrar: () => void }) {
  const url = useRef<string | null>(null);
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const u = URL.createObjectURL(nota.blob);
    url.current = u;
    setSrc(u);
    return () => URL.revokeObjectURL(u);
  }, [nota.blob]);

  return (
    <li className="flex items-center gap-3 rounded-xl bg-white/80 p-2 dark:bg-slate-700/60">
      <audio controls src={src} className="h-9 flex-1" />
      <button
        type="button"
        onClick={onBorrar}
        className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-300"
      >
        Borrar
      </button>
    </li>
  );
}
