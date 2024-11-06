export interface TourExcel {
  destino: string;
  codigo: string;
  tipo: string;
  dias: number;
  noches: number;
  lugares: number;
  lugaresOcupados?: number;
  lugaresLibres?: number;
  fechaInicio: string;
  transporte?: string;
  fechaRegreso: string;
  coordinadores: string;
  portada: string;
  recomendaciones: string;
  salida: string;
  llegada: string;
  horaDeRegreso: string;
  horaDeAbordaje: string;
  estatus: string;
  precios: string;
}
