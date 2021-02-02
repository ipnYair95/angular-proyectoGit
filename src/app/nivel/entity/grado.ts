import { Asignatura } from './asignatura';
export class Grado{
    id: number;
    nombreGrado: string;
    jerarquia: number;
    asignaturas: Asignatura[] = [];
}