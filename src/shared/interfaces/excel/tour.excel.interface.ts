export interface TourExcel {
  destino: string;
  codigo: string;
  tipoDeTour: string;
  dias: number;
  noches: number;
  lugares: number;
  lugaresOcupados?: number;
  lugaresLibres?: number;
  fechaInicio: string;
  transporte?: string;
  fechaRegreso: string;
  recomendaciones: string;
  horaDeRegreso: string;
  horaDeAbordaje: string;
  serviciosIncluidos?: string;
}
