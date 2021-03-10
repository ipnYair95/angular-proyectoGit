import { Asignatura } from './asignatura';
import { CicloEscolar } from './cicloEscolar';
export class Grado{
    id: number;
    nombreGrado: string;
    jerarquia: number;
    asignaturas: Asignatura[] = [];

    cicloEscolar : CicloEscolar;
}