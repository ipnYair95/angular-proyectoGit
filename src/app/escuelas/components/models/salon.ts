import { Grupo } from './grupos';
export class Salon{
    id: string;
    nombre: string;
    capacidad: string;
    estatus: string;

    grupos: Grupo[] = [];
}