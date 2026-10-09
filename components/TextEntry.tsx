"use client";

interface Props {
  valor: string;
  onCambio: (valor: string) => void;
  maximo: number;
}

export function TextEntry({ valor, onCambio, maximo }: Props) {
  return (
    <section className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-slate-800/70">
      <label htmlFor="estado" className="mb-2 block text-lg font-semibold">
        ¿Cómo te sientes ahora?
      </label>
      <textarea
        id="estado"
        value={valor}
        onChange={(e) => onCambio(e.target.value.slice(0, maximo))}
        rows={5}
        placeholder="Escribe con libertad, sin filtros. Nadie más lo verá sin tu permiso."
        className="w-full resize-y rounded-xl border border-slate-200 bg-white/90 p-3 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
      />
      <div className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
        {valor.length} / {maximo}
      </div>
    </section>
  );
}
