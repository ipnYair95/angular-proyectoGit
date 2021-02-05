import { CicloEscolar } from '../../../nivel/entity/cicloEscolar';
import { Salon } from './salon';
export class Grupo{
    id: number;
    idGrado: number;
    idCicloEscolar: number;
    nombreGrupo: string;
    salon: Salon;

}

export class GrupoAux{

    id: number;
    idGrado: number;
    idCicloEscolar: number;
    nombreGrupo: string;
    salon: Salon;
    nombreGrado: string;

}