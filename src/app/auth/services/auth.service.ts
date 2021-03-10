import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { Notificaciones, Opcion } from '../../ayudas/notificaciones';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL: string = environment.urlSpring + '/api/usuarios';

  private _existeToken: boolean;
  private _usuario: Usuario;
  private _tipoUsuario: string;

  get usuario() {
    return { ...this._usuario };
  }

  get tipoUsuario() {
    return this._tipoUsuario;
  }

  get isToken() {
    return this._existeToken;
  }

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('token')) {
      this._tipoUsuario = (jwtDecode(sessionStorage.getItem('token')) as any).rol;
      this._existeToken = true;
    }
  }

  public crear(nombre: string, email: string, password: string, rol: string) {

    let body = new Body();

    body.nombre = nombre;
    body.email = email;
    body.password = password;
    body.rol = rol;

    console.log( "miau", body );


    return this.http.post<AuthResponse>(`${this.URL}/crear`, body).pipe(
      tap(resp => {
        if (resp.ok) {
          sessionStorage.setItem('token', resp.token);
          this._tipoUsuario = (jwtDecode(sessionStorage.getItem('token')) as any).rol;
          this._existeToken = true;

        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    );
  }

  public login(nombre: string, password: string) {

    const body = { nombre, password };

    return this.http.post<AuthResponse>(`${this.URL}/login`, body).pipe(
      tap(resp => {
        if (resp.ok) {
          sessionStorage.setItem('token', resp.token)
          this._existeToken = true;
          this._tipoUsuario = (jwtDecode(sessionStorage.getItem('token')) as any).rol;

        }
      }),
      catchError(err => {
        Notificaciones.enviarNotificacion(Opcion.errorCustom, ` ${err.error.mensaje} `);
        return of(false);
      }

      )
    );

  }

  public logout() {
    this._existeToken = false;;
    sessionStorage.clear();
  }

  public validarToken() {

    let token : Token = new Token()
    token.token = sessionStorage.getItem('token') || '';

    return this.http.post<any>(`${this.URL}/validarToken`, token ).pipe(
      map(resp => {
        //console.log(resp);
        return resp;
      }),
      catchError(err => {
        //console.log(err);
        return of(false)
      })

    );
  }

}

export class Token {
  token: string;
}

export class Body {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}
