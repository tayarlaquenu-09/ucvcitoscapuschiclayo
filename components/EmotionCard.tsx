import type { AnalisisEmocional } from "@/lib/types";
import { ESTILO_PATRON, ESTILO_SEMAFORO } from "@/lib/risk";

export function EmotionCard({ analisis }: { analisis: AnalisisEmocional }) {
  const estilo = ESTILO_SEMAFORO[analisis.semaforo];

  return (
    <section
      role="status"
      className={`rounded-2xl border p-5 shadow-sm transition-colors duration-500 ${estilo.fondo} ${estilo.borde}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Emoción identificada
          </p>
          <p className={`text-2xl font-bold capitalize ${estilo.texto}`}>{analisis.emocion}</p>
        </div>
        <div className="flex items-center gap-2" aria-label={`Semáforo: ${estilo.etiqueta}`}>
          <span className={`h-4 w-4 rounded-full ${estilo.punto} shadow`} />
          <span className={`text-sm font-medium ${estilo.texto}`}>{estilo.etiqueta}</span>
        </div>
      </div>

      {analisis.patrones.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {analisis.patrones.map((p) => (
            <span key={p} className={`rounded-full px-3 py-1 text-xs font-medium ${ESTILO_PATRON[p]}`}>
              {p}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
