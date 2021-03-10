import { Carrera } from './carrera';

export class Nivel{
    id: number;
    nombreNivel: string;
    jerarquia: number;
    carreras: Carrera[] = [];    
}