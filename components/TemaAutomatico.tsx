"use client";

import { useEffect } from "react";

/** Modo noche entre 19:00 y 06:59 según la hora local. Revisa cada minuto. */
export function esHoraNoche(fecha: Date = new Date()): boolean {
  const hora = fecha.getHours();
  return hora >= 19 || hora < 7;
}

/** Aplica la clase `dark` al <html> según la hora del día. No renderiza nada. */
export function TemaAutomatico() {
  useEffect(() => {
    const aplicar = () => {
      document.documentElement.classList.toggle("dark", esHoraNoche());
    };
    aplicar();
    const id = window.setInterval(aplicar, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return null;
}
