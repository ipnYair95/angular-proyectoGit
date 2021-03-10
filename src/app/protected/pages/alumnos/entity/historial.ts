import { Alumno } from './alumno';
export class Historial{
    id: number;
	idGrupo: number;
	fechaAlta: Date;
	estaActivo: boolean;
	promedio: string;

	alumno: Alumno;
}