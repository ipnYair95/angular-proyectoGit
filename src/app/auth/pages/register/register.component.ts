import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Notificaciones, Opcion } from '../../../ayudas/notificaciones';
import { AlumnoService } from '../../../protected/pages/alumnos/services/alumno.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  forma: FormGroup;
  title: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alumnoService: AlumnoService
  ) {

    this.title = "CREAR CUENTA DEL ALUMNO"

    this.forma = this.fb.group({
      nombre: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      rol: ['usuario'],
    });

  }

  registrar() {

    const { nombre, email, password, rol } = this.forma.value;

    this.alumnoService.buscarPorCurp(nombre).subscribe(resp => {

      if (resp === false) {

        return;
      }

      this.authService.crear(nombre, email, password, rol).subscribe(ok => {

        if (ok === true) {
          Notificaciones.enviarNotificacion(Opcion.exitoCustom, "Cuenta creada");
          this.router.navigateByUrl('/dashboard');
        } else {
          console.log(ok);
          Notificaciones.enviarNotificacion(Opcion.errorCustom, ` ${ok} `);
        }

      });



    });


  }



}
