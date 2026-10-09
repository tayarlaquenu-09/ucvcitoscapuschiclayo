# Bootcamp UCV · Hackathon de Salud Mental con IA

Aplicación de bienestar emocional para estudiantes, con análisis de IA y una bandeja para el personal de salud mental.

## Funciones

- **Modo día/noche automático:** cambia a tema oscuro entre las 19:00 y las 06:59.
- **Registro de estado:** caja de texto y grabadora de notas de voz (guardadas 24 h en el navegador, máximo 5).
- **Análisis con IA:** emoción, semáforo (verde, amarillo, rojo), patrones y tarjetas de aliento o ejercicios de respiración o grounding.
- **Reproductor de sonidos de fondo:** Play/Pausa y barra de progreso.
- **Bandeja del personal** (`/bandeja`): casos ficticios ordenados de nivel 5 a nivel 1, con etiquetas de patrón y resumen de dos líneas.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa ANTHROPIC_API_KEY
npm run dev
```

Abre http://localhost:3000. La bandeja está en http://localhost:3000/bandeja.

## Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Sí | Análisis de emociones y tarjetas |
| `ANTHROPIC_MODEL` | No | Modelo (por defecto `claude-haiku-5-5`) |
| `OPENAI_API_KEY` | No | Transcripción de notas de voz con Whisper |

Sin `OPENAI_API_KEY`, las notas de voz se guardan y se reproducen, pero no se transcriben. El análisis usa solo el texto escrito.

## Pistas de fondo

Agrega estos archivos en `public/audio/`:
- `lluvia.mp3`
- `olas.mp3`
- `piano.mp3`

Si falta alguno, el reproductor muestra un aviso.

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. En **Settings > Environment Variables**, agrega `ANTHROPIC_API_KEY` (y `OPENAI_API_KEY` si quieres transcripción).
3. Despliega. Vercel detecta Next.js y usa `npm run build`.

## Limitaciones conocidas

- Los resultados del estudiante no llegan a la bandeja. La bandeja usa casos ficticios de `lib/cases.ts`; no hay base de datos.
- Las notas de voz se guardan solo en el navegador de quien graba.
- Esta herramienta no reemplaza la atención profesional. La línea de apoyo mostrada (113, opción 5) debe verificarse con el servicio vigente antes de presentarla.
