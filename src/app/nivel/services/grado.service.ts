import { Injectable } from '@angular/core';
import { Grado } from '../entity/grado';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GradoService {

  private URL = 'http://localhost:8090/api/nivel-educativo//nivel/carrera/ciclo-escolar/grado';

  constructor(private http: HttpClient) {}

  public listar(): Observable<Grado[]> {
    return this.http.get<Grado[]>(` ${this.URL}/listar `);
  }

  public agregar( idCicloEscolar: number, carrera: Grado): Observable<Grado> {
    return this.http.post<Grado>(`${this.URL}/${idCicloEscolar}/crear`, carrera);
  }

  public buscarPorId(  id : number) : Observable<Grado>{
    return this.http.get<Grado>(`${this.URL}/buscar-por-id/${id}`);
  }

  public editar( idCicloEscolar :number , id : number ,carrera: Grado, ): Observable<Grado> {
    return this.http.put<Grado>(`${this.URL}/${idCicloEscolar}/editar/${id}`, carrera);
  }

  public eliminar(  idCicloEscolar :number , id : number ) {
    return this.http.delete<Grado>(`${this.URL}/${idCicloEscolar}/eliminar/${id}`);
  }


}
