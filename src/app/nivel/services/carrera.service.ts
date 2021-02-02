import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nivel } from '../entity/nivel';
import { Carrera } from '../entity/carrera';

@Injectable({
  providedIn: 'root',
})
export class CarreraService {
  private URL = 'http://localhost:8090/api/nivel-educativo/nivel/carrera';

  constructor(private http: HttpClient) {}

  public listar(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(` ${this.URL}/listar `);
  }

  public agregar( idNivel: number, carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(`${this.URL}/${idNivel}/crear`, carrera);
  }

  public buscarPorId(  id : number) : Observable<Carrera>{
    return this.http.get<Carrera>(`${this.URL}/buscar-por-id/${id}`);
  }

  public editar( idNivel :number , id : number ,carrera: Carrera, ): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.URL}/${idNivel}/editar/${id}`, carrera);
  }

  public eliminar(  idNivel :number , id : number ) {
    return this.http.delete<Carrera>(`${this.URL}/${idNivel}/eliminar/${id}`);
  }


}
