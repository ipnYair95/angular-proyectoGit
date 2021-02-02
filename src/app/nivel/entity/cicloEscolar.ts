import { Grado } from './grado';
export class CicloEscolar{
    id: number;
    nombreCiclo: string;
    fechaInicio: string;
    fechaTermino: string;
    grados: Grado[] = [];
    
}