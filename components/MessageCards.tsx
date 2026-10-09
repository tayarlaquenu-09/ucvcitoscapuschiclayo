import type { TarjetaTexto } from "@/lib/types";

const ICONO: Record<TarjetaTexto["tipo"], string> = {
  mensaje: "💬",
  respiracion: "🌬️",
  grounding: "🌱",
};

/** Renderiza mensajes de aliento y ejercicios (respiración o grounding) como tarjetas. */
export function MessageCards({ tarjetas }: { tarjetas: TarjetaTexto[] }) {
  if (tarjetas.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tarjetas.map((t, i) => (
        <article
          key={`${t.tipo}-${i}`}
          className="rounded-2xl bg-white/80 p-5 shadow-sm dark:bg-slate-800/80"
        >
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <span aria-hidden="true">{ICONO[t.tipo]}</span>
            {t.titulo}
          </h3>
          {t.tipo === "mensaje" ? (
            <p className="leading-relaxed text-slate-700 dark:text-slate-200">{t.contenido.join(" ")}</p>
          ) : (
            <ol className="list-decimal space-y-1 pl-5 text-slate-700 dark:text-slate-200">
              {t.contenido.map((paso, j) => (
                <li key={j}>{paso}</li>
              ))}
            </ol>
          )}
        </article>
      ))}
    </div>
  );
}
