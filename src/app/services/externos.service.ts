import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from '../models-externos/estado';
import { Municipio } from '../models-externos/municipio';
import { CodigoPostal } from '../models-externos/codigo-postal';
import { Colonia } from '../models-externos/colonia';

@Injectable({
  providedIn: 'root'
})
export class ExternosService {

  constructor(private http: HttpClient) { }

  obtenerEstados() : Observable<Estado>{
    return this.http.get<Estado>( `https://api-sepomex.hckdrk.mx/query/get_estados` );
  }

  obtenerMunicipios( estado: string ) : Observable<Municipio>{
    return this.http.get<Municipio>( `https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/${estado}` );
  }

  obtenerCodigoPostal( municipio : string ) : Observable<CodigoPostal>{
    return this.http.get<CodigoPostal>( `https://api-sepomex.hckdrk.mx/query/get_cp_por_municipio/${municipio}` );
  }

  obtenerColonias( cp: string ) : Observable<Colonia>{
    return this.http.get<Colonia>( `https://api-sepomex.hckdrk.mx/query/get_colonia_por_cp/${cp}` );
  }



}
