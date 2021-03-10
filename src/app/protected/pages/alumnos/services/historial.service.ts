import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { Alumno } from '../entity/alumno';
import { Historial } from '../entity/historial';
import { Notificaciones, Opcion } from '../../../../ayudas/notificaciones';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  URL: string =  environment.urlSpring + '/api/alumnos/historial';

  constructor(private http: HttpClient) {}

  public listarAlumnosByGrupo( idGrupo: number ) : Observable<Historial[]>{
    return this.http.get<Historial[]>(`${this.URL}/listar-alumnos/${idGrupo}`);
  }

  public cambiarGrupo( historial: Historial ){
    return this.http.put<any>(`${this.URL}/cambio-grupo/${historial.id}`, historial.idGrupo).pipe(
      tap( resp => resp ),
      catchError( err => {
        Notificaciones.enviarNotificacion( Opcion.error );
        return of(false);
      })
    );
  }

  public bajaAlumno( historial: Historial ) : Observable<any> {
    console.log("miau");
    return this.http.put<any>(`${this.URL}/baja-alumno/${historial.id}`, historial );
  }

  public cambioDeEscuela( historial: Historial ) : Observable<any> {
    return this.http.put<any>( `${this.URL}/cambio-escuela/${historial.id}`, historial );
  }

  public asignarHistorial( idAlumno: number, historial: Historial ){
    return this.http.post<Historial>( `${this.URL}/asignar-historial/${idAlumno}`, historial );
  }

  public buscarUltimoRegistroHistorial(id: number): Observable<Historial> {
    return this.http.get<Historial>(`${this.URL}/buscar-estatus-alumno/${id}`);
  }


}
