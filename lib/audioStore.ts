/**
 * Almacenamiento temporal de notas de voz en IndexedDB (solo en el navegador).
 * Las notas caducan a las 24 horas y se conservan como máximo 5.
 */

const NOMBRE_DB = "bienestar-audio";
const STORE = "notas";
const VERSION = 1;
const CADUCIDAD_MS = 24 * 60 * 60 * 1000;
const MAXIMO_NOTAS = 5;

export interface NotaVoz {
  id: string;
  creada: number;
  tipo: string;
  blob: Blob;
}

function abrirDB(): Promise<IDBDatabase> {
  return new Promise((resolver, rechazar) => {
    const solicitud = indexedDB.open(NOMBRE_DB, VERSION);
    solicitud.onupgradeneeded = () => {
      solicitud.result.createObjectStore(STORE, { keyPath: "id" });
    };
    solicitud.onsuccess = () => resolver(solicitud.result);
    solicitud.onerror = () => rechazar(solicitud.error);
  });
}

function ejecutar<T>(
  modo: IDBTransactionMode,
  operacion: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return abrirDB().then(
    (db) =>
      new Promise<T>((resolver, rechazar) => {
        const tx = db.transaction(STORE, modo);
        const solicitud = operacion(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolver(solicitud.result);
        };
        tx.onerror = () => {
          db.close();
          rechazar(tx.error);
        };
      }),
  );
}

export async function guardarNota(blob: Blob): Promise<NotaVoz> {
  const nota: NotaVoz = {
    id: crypto.randomUUID(),
    creada: Date.now(),
    tipo: blob.type || "audio/webm",
    blob,
  };
  await ejecutar("readwrite", (store) => store.put(nota));
  await purgarNotas();
  return nota;
}

export async function listarNotas(): Promise<NotaVoz[]> {
  const notas = await ejecutar<NotaVoz[]>("readonly", (store) => store.getAll());
  return notas.sort((a, b) => b.creada - a.creada);
}

export async function eliminarNota(id: string): Promise<void> {
  await ejecutar("readwrite", (store) => store.delete(id));
}

/** Borra notas caducadas y deja solo las más recientes hasta el máximo permitido. */
export async function purgarNotas(): Promise<void> {
  const notas = await listarNotas();
  const ahora = Date.now();
  const sobrantes = notas.filter(
    (n, i) => i >= MAXIMO_NOTAS || ahora - n.creada > CADUCIDAD_MS,
  );
  for (const nota of sobrantes) {
    await eliminarNota(nota.id);
  }
}
