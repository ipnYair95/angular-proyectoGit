import { Domicilio } from '../../../alumnos/entity/domicilio';
import { Salon } from './salon';
import { NivelEscuela } from './relaciones';
export class Cct{
    
    id: number;
    cct: string;
    nombre: string;
    turno: string;
    email: string;
    telefono: string;
    extension: string;
    sostenimiento: string;
    dependenciaNormativa: string;

    domicilio: Domicilio
    salones: Salon[] = [];
    nivelEscuela: NivelEscuela[] = [];
    
}

