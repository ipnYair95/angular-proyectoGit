import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Notificaciones, Opcion } from '../../../ayudas/notificaciones';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  forma: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {

    this.forma = this.fb.group({
      nombre: ['15EPR4054C', [Validators.required]],
      password: ['p181@4054c', [Validators.required]]
    });

  }

  login() {

    //console.log( this.forma.value );

    const { nombre, password } = this.forma.value;

    this.authService.login(nombre, password).subscribe(resp => { 
      
      if (resp !== false) {
        this.router.navigateByUrl('/dashboard');
      }

    });

  }


}
