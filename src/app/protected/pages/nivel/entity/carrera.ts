import { CicloEscolar } from './cicloEscolar';
import { Nivel } from './nivel';
export class Carrera{
    id: number;
    nombreCarrera: string;
    ciclosEscolares : CicloEscolar[] = [];    

    nivel:Nivel;
}