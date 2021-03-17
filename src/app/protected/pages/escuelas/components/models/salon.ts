import { Grupo } from './grupos';
import { Cct } from './cct';
export class Salon{
    id: number;
    nombre: string;
    capacidad: string;
    estatus: string;

    grupos: Grupo[] = [];

    
    centroDeTrabajo: Cct;
}