import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, JsonpClientBackend } from '@angular/common/http';
import { Cct } from '../components/models/cct';
import { Observable } from 'rxjs';
import { Grupo } from '../components/models/grupos';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  

  URL: string =  environment.urlSpring + '/api/centro-de-trabajo/grupos';

  constructor(private http: HttpClient) {}
 

  public buscar( idGrupo: number ) : Observable<Grupo>{
    return this.http.get<Grupo>(`${this.URL}/buscar-por-id/${ idGrupo }`);
  }

  public crear( idSalon: string, grupo: Grupo ) : Observable<Grupo> {
    return this.http.post<Grupo>( `${this.URL}/${idSalon}/crear`,  grupo );
  }

  public editar( grupo: Grupo ) : Observable<Grupo>{
    console.log( grupo.id );
    return this.http.put<Grupo>(`${this.URL}/editar/${grupo.id}`, grupo);
  }

  public elmiinar( idGrupo: number ){
    return this.http.delete( `${this.URL}/eliminar/${idGrupo}` );
  }

  
 

}
