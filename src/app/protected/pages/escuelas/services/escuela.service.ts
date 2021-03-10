import { Injectable } from '@angular/core';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Cct } from '../components/models/cct';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Notificaciones, Opcion } from '../../../../ayudas/notificaciones';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {
  

  URL: string =  environment.urlSpring + '/api/centro-de-trabajo';

  constructor(private http: HttpClient) {}

  public listar() :Observable<Cct[]> {
    return this.http.get<Cct[]>( `${this.URL}/listar` );
  }

  public buscarPodId( Id : number ): Observable<Cct> {
    return this.http.get<Cct>(` ${this.URL}/buscar-por-id/${Id}`);
  }

  // por default el map es estado 200 y ok, si ocurre un error debemos de agarrar el catch
  public buscarPorCct( cct: String  ) {

    return this.http.get<Cct>(` ${this.URL}/buscar-por-cct/${cct}`).pipe(
      map( resp =>{
        console.log(resp);
        return resp;
      }),
      catchError(err => {
        //console.log(err.error.mensaje);
        Notificaciones.enviarNotificacion( Opcion.errorCustom, err.error.mensaje );
        return of( false );
      })
    );

  }

  public crear( CCT: Cct ) : Observable<any> {
    return this.http.post<any>( `${this.URL}/crear`, CCT );
  }

  public editar( CCT: Cct ) : Observable<any> {
    return this.http.put<any>( `${this.URL}/editar/${CCT.id}`, CCT );
  }

  public validaUsuario() : boolean {

    if( sessionStorage.getItem('usuario') ){
      return true;
    }  
    return false;
  }

  public getUsuario(){
    return JSON.parse( sessionStorage.getItem('usuario') );
  }




}
