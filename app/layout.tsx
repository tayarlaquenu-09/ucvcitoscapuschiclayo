import type { Metadata } from "next";
import "./globals.css";
import { TemaAutomatico } from "@/components/TemaAutomatico";

export const metadata: Metadata = {
  title: "Bienestar emocional",
  description: "Espacio para registrar cómo te sientes y recibir apoyo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <TemaAutomatico />
        {children}
      </body>
    </html>
  );
}
