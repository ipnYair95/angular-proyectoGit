import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nivel } from '../entity/nivel';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NivelService {
  URL: string =  environment.urlSpring + '/api/nivel-educativo/nivel';

  constructor(private http: HttpClient) {}

  public listar(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(` ${this.URL}/listar `);
  }

  public agregar(nivel: Nivel): Observable<Nivel> {
    return this.http.post<Nivel>(`${this.URL}/crear`, nivel);
  }

  public buscarPorId(  id : number) : Observable<Nivel>{
    return this.http.get<Nivel>(`${this.URL}/buscar-por-id/${id}`);
  }

  public editar(nivel: Nivel, id : number): Observable<Nivel> {
    return this.http.put<Nivel>(`${this.URL}/editar/${id}`, nivel);
  }

  public eliminar(  id : number) {
    return this.http.delete<Nivel>(`${this.URL}/eliminar/${id}`);
  }



}
