import { NextResponse } from "next/server";
import { analizarTexto } from "@/lib/analyze";

export const runtime = "nodejs";

const MAX_CARACTERES = 4000;

export async function POST(request: Request) {
  let texto = "";
  try {
    const cuerpo = (await request.json()) as { texto?: unknown };
    texto = typeof cuerpo.texto === "string" ? cuerpo.texto.trim() : "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!texto) {
    return NextResponse.json({ error: "Escribe algo antes de analizar." }, { status: 400 });
  }
  if (texto.length > MAX_CARACTERES) {
    return NextResponse.json(
      { error: `El texto supera ${MAX_CARACTERES} caracteres.` },
      { status: 413 },
    );
  }

  try {
    const analisis = await analizarTexto(texto);
    return NextResponse.json(analisis);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
