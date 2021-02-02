import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NivelEscuela, ModalidadNivel } from '../components/models/relaciones';

@Injectable({
  providedIn: 'root'
})
export class RelacionEducativoService {
  

  private URL = 'http://localhost:8090/api/centro-de-trabajo/nivel';

  constructor(private http: HttpClient) {}

  public asignarNivel( idEscuela: number, nivelEscuela: NivelEscuela) : Observable<any>{
    return this.http.post<any>( `${this.URL}/${idEscuela}/asignar-nivel`, nivelEscuela );
  }

  public eliminarNivel( idEscuela: number, idRelacion : number) : Observable<any> {
    return this.http.delete<any>(`${this.URL}/${idEscuela}/eliminar-nivel/${idRelacion}`);
  }

  public asignarModalidad( idNivelEscuela: number, modalidadNivel: ModalidadNivel) : Observable<any>{
    return this.http.post<any>( `${this.URL}/modalidad/${idNivelEscuela}/asignar-modalidad`, modalidadNivel );
  }

  public eliminarModalidad( idNivelEscuela: number, idRelacion : number) : Observable<any> {
    return this.http.delete<any>(`${this.URL}/modalidad/${idNivelEscuela}/eliminar-modalidad/${idRelacion}`);
  }


}
