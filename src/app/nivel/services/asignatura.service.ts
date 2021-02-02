import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { Asignatura } from '../entity/asignatura';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  private URL = 'http://localhost:8090/api/nivel-educativo//nivel/carrera/ciclo-escolar/grado/asignatura';

  constructor(private http: HttpClient) {}

  public listar(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(` ${this.URL}/listar `);
  }

  public agregar( idGrado: number, asignatura: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(`${this.URL}/${idGrado}/crear`, asignatura);
  }

  public buscarPorId(  id : number) : Observable<Asignatura>{
    return this.http.get<Asignatura>(`${this.URL}/buscar-por-id/${id}`);
  }

  public editar( idGrado :number , id : number ,asignatura: Asignatura, ): Observable<Asignatura> {
    return this.http.put<Asignatura>(`${this.URL}/${idGrado}/editar/${id}`, asignatura);
  }

  public eliminar(  idGrado :number , id : number ) {
    return this.http.delete<Asignatura>(`${this.URL}/${idGrado}/eliminar/${id}`);
  }


}
