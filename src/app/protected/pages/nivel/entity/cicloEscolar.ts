import { Grado } from './grado';
import { Carrera } from './carrera';
export class CicloEscolar{
    id: number;
    nombreCiclo: string;
    fechaInicio: string;
    fechaTermino: string;
    grados: Grado[] = [];

    carrera: Carrera;
    
}