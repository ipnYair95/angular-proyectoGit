import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioGuard implements CanActivate, CanLoad {


  constructor( ){        

  }

  canActivate(): Observable<boolean> | boolean  {

    const tipoUsuario = (jwtDecode( sessionStorage.getItem('token') ) as any).rol;
    
    if( tipoUsuario == 'usuario' ){
      return of(false);
    }

    return of(true);
    
  }
  canLoad(): Observable<boolean> | boolean {

    const tipoUsuario = (jwtDecode( sessionStorage.getItem('token') ) as any).rol;
    
    if( tipoUsuario == 'usuario' ){
      return of(false);
    }

    return of(true);
    
    
  }
}
