import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

import { Alumno } from '../entity/alumno';
import { Historial } from '../entity/historial';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  URL: string = 'http://localhost:8090/api/alumnos/historial';

  constructor(private http: HttpClient) {}

  public asignarHistorial( idAlumno: number, historial: Historial ){
    return this.http.post<Historial>( `${this.URL}/asignar-historial/${idAlumno}`, historial );
  }

  public buscarUltimoRegistroHistorial(id: number): Observable<Historial> {
    return this.http.get<Historial>(`${this.URL}/buscar-estatus-alumno/${id}`);
  }


}
