import { Injectable } from '@angular/core';
import { Grado } from '../entity/grado';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradoService {

  URL: string =  environment.urlSpring + '/api/nivel-educativo/nivel/carrera/ciclo-escolar/grado';

  constructor(private http: HttpClient) {}

  public listar(): Observable<Grado[]> {
    return this.http.get<Grado[]>(` ${this.URL}/listar `);
  }

  public agregar( idCicloEscolar: number, grado: Grado): Observable<Grado> {
    return this.http.post<Grado>(`${this.URL}/${idCicloEscolar}/crear`, grado);
  }

  public buscarPorId(  id : number) : Observable<Grado>{
    return this.http.get<Grado>(`${this.URL}/buscar-por-id/${id}`);
  }

  public editar( idCicloEscolar :number , id : number ,grado: Grado, ): Observable<Grado> {
    return this.http.put<Grado>(`${this.URL}/${idCicloEscolar}/editar/${id}`, grado);
  }

  public eliminar(  idCicloEscolar :number , id : number ) {
    return this.http.delete<Grado>(`${this.URL}/${idCicloEscolar}/eliminar/${id}`);
  }


}
