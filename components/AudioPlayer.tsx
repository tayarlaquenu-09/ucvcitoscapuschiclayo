"use client";

import { useRef, useState } from "react";

export interface Pista {
  titulo: string;
  src: string;
}

interface Props {
  pistas: Pista[];
}

function formatear(segundos: number): string {
  if (!Number.isFinite(segundos)) return "0:00";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Reproductor de pistas de fondo con Play/Pausa y barra de progreso. */
export function AudioPlayer({ pistas }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [indice, setIndice] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [actual, setActual] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pista = pistas[indice];

  function alternar() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setError("No se pudo reproducir la pista."));
    } else {
      audio.pause();
    }
  }

  function cambiarPista(nuevo: number) {
    setIndice(nuevo);
    setProgreso(0);
    setError(null);
  }

  function buscar(valor: number) {
    const audio = audioRef.current;
    if (!audio || !duracion) return;
    audio.currentTime = (valor / 100) * duracion;
    setProgreso(valor);
  }

  if (pistas.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-slate-800/70">
      <h2 className="mb-1 text-lg font-semibold">Sonidos para relajarte</h2>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{pista.titulo}</p>

      <audio
        ref={audioRef}
        src={pista.src}
        preload="metadata"
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        onEnded={() => {
          setReproduciendo(false);
          if (indice < pistas.length - 1) cambiarPista(indice + 1);
        }}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setActual(a.currentTime);
          if (a.duration) setProgreso((a.currentTime / a.duration) * 100);
        }}
        onError={() => setError("No se encontró el archivo de audio. Revisa la carpeta public/audio.")}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={alternar}
          aria-label={reproduciendo ? "Pausar" : "Reproducir"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 text-white shadow hover:bg-indigo-600"
        >
          {reproduciendo ? "❚❚" : "▶"}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progreso}
          onChange={(e) => buscar(Number(e.target.value))}
          aria-label="Progreso de la pista"
          className="flex-1 accent-indigo-500"
        />
        <span className="w-24 text-right text-xs tabular-nums text-slate-600 dark:text-slate-300">
          {formatear(actual)} / {formatear(duracion)}
        </span>
      </div>

      {error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {pistas.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pistas.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => cambiarPista(i)}
              className={`rounded-full px-3 py-1 text-xs ${
                i === indice
                  ? "bg-indigo-500 text-white"
                  : "bg-white/80 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              {p.titulo}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
