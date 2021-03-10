import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {

  constructor(private AuthService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | boolean {

    return this.AuthService.validarToken().pipe(
      tap( (resp: boolean) => {

        if( !resp ){
          this.router.navigateByUrl('/auth');
        }

        console.log(resp); 
        return resp;
      })
    )
 

  }
  canLoad(): Observable<boolean> | boolean {

    return this.AuthService.validarToken().pipe(
      tap( (resp: boolean) => {

        if( !resp ){
          this.router.navigateByUrl('/auth');
        }

        console.log(resp); 
        return resp;
      })
    )
    

  }
}

