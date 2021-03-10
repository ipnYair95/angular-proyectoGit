import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Alumno } from '../entity/alumno';
import { Notificaciones, Opcion } from '../../../../ayudas/notificaciones';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  URL: string =  environment.urlSpring  + '/api/alumnos';
 
  
  constructor(private http: HttpClient) {
    console.log(this.URL);
  }

  public crear(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(`${this.URL}/crear`, alumno);
  }

  public buscarPorId(id: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.URL}/buscar-por-id/${id}`);
  }

  public buscarPorCurp(texto: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/buscar-por-curp/${texto}`).pipe(
      map( resp => resp ),
      catchError( err =>{
        Notificaciones.enviarNotificacion( Opcion.errorCustom, err.error.mensaje );
        return of(false);
      })
    );
  }

  public buscarPorApellido(texto: string): Observable<any> {
    return this.http.get<any>(`${this.URL}/buscar-por-apellido/${texto}`);
  }

  public editar(alumno: Alumno, id: number): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.URL}/editar/${id}`, alumno);
  }

  public eliminar( id: string ){
    return this.http.delete(  ` ${this.URL}/eliminar/${id}` );
  }

  public listar(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.URL}/listar`);
  }

  public descargarListaPdf(  )  {
    
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf'  );    

    return this.http.get( `${ this.URL }/report/pdf`, {
      headers: headers,
      responseType: 'arraybuffer'
    });    
  
  }

  public descargarFichaAlumno( id : String )  {

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf'  );    

    return this.http.get( `${ this.URL }/reportInfo/${id}`, {
      headers: headers,
      responseType: 'arraybuffer'
    });
  
  }

}
