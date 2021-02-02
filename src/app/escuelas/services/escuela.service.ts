import { Injectable } from '@angular/core';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Cct } from '../components/models/cct';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {
  

  private URL = 'http://localhost:8090/api/centro-de-trabajo';

  constructor(private http: HttpClient) {}

  public listar() :Observable<Cct[]> {
    return this.http.get<Cct[]>( `${this.URL}/listar` );
  }

  public buscarPodId( Id : number ): Observable<Cct> {
    return this.http.get<Cct>(` ${this.URL}/buscar-por-id/${Id}`);
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
