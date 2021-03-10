import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { AlumnoService } from '../../alumnos/services/alumno.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Alumno } from '../../alumnos/entity/alumno';

@Component({
  selector: 'app-alumno-info',
  templateUrl: './alumno-info.component.html',
  styleUrls: ['./alumno-info.component.css']
})
export class AlumnoInfoComponent implements OnInit {


  alumno : Alumno;

  constructor( private router: Router,private alumnoService: AlumnoService, private authService: AuthService ) { 
    
    let { nombre } = jwtDecode( sessionStorage.getItem('token') ) as any;
    
    this.alumnoService.buscarPorCurp( nombre ).subscribe( resp =>{
      
      // algo salio mal
      if( resp === false ){
        this.authService.logout();
        this.router.navigate(['/']);
        return;
      }     
      
      console.log(resp);
      this.alumno = resp;
      sessionStorage.setItem( "usuario", JSON.stringify( resp ) );   
      return;

    });

  }

  ngOnInit(): void {
  }

}
