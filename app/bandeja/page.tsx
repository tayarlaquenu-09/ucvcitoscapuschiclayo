import { CaseList } from "@/components/CaseList";
import { CASOS_FICTICIOS } from "@/lib/cases";

export const metadata = {
  title: "Bandeja de casos · Salud mental",
};

export default function Bandeja() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Bandeja de casos</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Casos ficticios para demostración. Ordenados por nivel de riesgo, de mayor a menor.
        </p>
      </header>
      <CaseList casos={CASOS_FICTICIOS} />
    </main>
  );
}
