export type Patron = "Fatiga" | "Aislamiento" | "Desesperanza";

export type Semaforo = "verde" | "amarillo" | "rojo";

export type NivelRiesgo = 1 | 2 | 3 | 4 | 5;

export type TipoTarjeta = "mensaje" | "respiracion" | "grounding";

export interface TarjetaTexto {
  tipo: TipoTarjeta;
  titulo: string;
  /** Mensaje de aliento o lista de pasos del ejercicio. */
  contenido: string[];
}

export interface AnalisisEmocional {
  emocion: string;
  semaforo: Semaforo;
  nivelRiesgo: NivelRiesgo;
  patrones: Patron[];
  resumen: string;
  tarjetas: TarjetaTexto[];
}

export interface CasoBandeja {
  id: string;
  alias: string;
  fecha: string;
  nivelRiesgo: NivelRiesgo;
  patrones: Patron[];
  resumen: string;
}
