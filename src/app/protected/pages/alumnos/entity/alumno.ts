import {  Domicilio } from './domicilio';
import { Persona } from './Persona';
import { Tutor } from './tutor';
import { Historial } from './historial';
export class Alumno extends Persona{
    
    peso: number;
    estatura: string;
    tipoSangre: string;
    usaLentes: boolean;

    inscritoEscuela: boolean;
    

    domicilio: Domicilio;
    tutores: Tutor[];
    historiales: Historial[];

}
