import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CicloEscolar } from '../entity/cicloEscolar';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CicloEscolarService {

  URL: string =  environment.urlSpring + '/api/nivel-educativo/nivel/carrera/ciclo-escolar';

  constructor(private http: HttpClient) {}

  public listar(): Observable<CicloEscolar[]> {
    return this.http.get<CicloEscolar[]>(` ${this.URL}/listar `);
  }

  public agregar( idNivel: number, carrera: CicloEscolar): Observable<CicloEscolar> {
    return this.http.post<CicloEscolar>(`${this.URL}/${idNivel}/crear`, carrera);
  }

  public buscarPorId(  id : number) : Observable<CicloEscolar>{
    return this.http.get<CicloEscolar>(`${this.URL}/buscar-por-id/${id}`);
  }

  public editar( idNivel :number , id : number ,carrera: CicloEscolar, ): Observable<CicloEscolar> {
    return this.http.put<CicloEscolar>(`${this.URL}/${idNivel}/editar/${id}`, carrera);
  }

  public eliminar(  idNivel :number , id : number ) {
    return this.http.delete<CicloEscolar>(`${this.URL}/${idNivel}/eliminar/${id}`);
  }
}
