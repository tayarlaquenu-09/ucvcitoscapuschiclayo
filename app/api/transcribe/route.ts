import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TAMANO_MAXIMO = 10 * 1024 * 1024; // 10 MB

/**
 * Transcribe una nota de voz con OpenAI Whisper.
 * Si no hay OPENAI_API_KEY, responde 501 y la app solo guarda el audio.
 */
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "La transcripción no está configurada.", disponible: false },
      { status: 501 },
    );
  }

  const formulario = await request.formData();
  const audio = formulario.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "No se recibió audio." }, { status: 400 });
  }
  if (audio.size > TAMANO_MAXIMO) {
    return NextResponse.json({ error: "El audio supera 10 MB." }, { status: 413 });
  }

  const envio = new FormData();
  envio.append("file", audio, audio.name || "nota.webm");
  envio.append("model", "whisper-1");
  envio.append("language", "es");

  const respuesta = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: envio,
  });

  if (!respuesta.ok) {
    return NextResponse.json(
      { error: `El servicio de transcripción respondió ${respuesta.status}.` },
      { status: 502 },
    );
  }

  const datos = (await respuesta.json()) as { text?: string };
  return NextResponse.json({ texto: datos.text ?? "", disponible: true });
}
