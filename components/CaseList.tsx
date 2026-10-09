import type { CasoBandeja, NivelRiesgo } from "@/lib/types";
import { ESTILO_PATRON, ESTILO_SEMAFORO, semaforoDesdeNivel } from "@/lib/risk";

/** Ordena por nivel de riesgo descendente y, a igual nivel, por fecha más reciente. */
export function ordenarCasos(casos: CasoBandeja[]): CasoBandeja[] {
  return [...casos].sort((a, b) => {
    if (b.nivelRiesgo !== a.nivelRiesgo) return b.nivelRiesgo - a.nivelRiesgo;
    return b.fecha.localeCompare(a.fecha);
  });
}

export function CaseList({ casos }: { casos: CasoBandeja[] }) {
  const ordenados = ordenarCasos(casos);

  return (
    <ul className="flex flex-col gap-4">
      {ordenados.map((caso) => {
        const estilo = ESTILO_SEMAFORO[semaforoDesdeNivel(caso.nivelRiesgo as NivelRiesgo)];
        return (
          <li
            key={caso.id}
            className={`rounded-2xl border p-5 shadow-sm ${estilo.fondo} ${estilo.borde}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${estilo.punto}`} aria-hidden="true" />
                <h2 className="font-semibold">{caso.alias}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-medium ${estilo.texto}`}>Nivel {caso.nivelRiesgo}</span>
                <time className="text-slate-500 dark:text-slate-400" dateTime={caso.fecha}>
                  {new Date(caso.fecha).toLocaleString("es-PE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </time>
              </div>
            </div>

            {caso.patrones.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {caso.patrones.map((p) => (
                  <span
                    key={p}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${ESTILO_PATRON[p]}`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 rounded-xl bg-white/70 p-3 dark:bg-slate-900/50">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Resumen
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{caso.resumen}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
