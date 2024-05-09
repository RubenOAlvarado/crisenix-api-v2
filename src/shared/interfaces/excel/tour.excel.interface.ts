export interface TourExcel {
  destino: string;
  codigo: string;
  tipo: string;
  dias: number;
  noches: number;
  boxLunch?: string;
  lugares: number;
  lugaresOcupados?: number;
  lugaresLibres?: number;
  fechaInicio: string;
  transporte?: string;
  fechaRegreso: string;
  coordinador: string;
  portada: string;
  recomendaciones: string;
  salida: string;
  llegada: string;
  horaDeRegreso: string;
  horaDeAbordaje: string;
  estatus: string;
}
