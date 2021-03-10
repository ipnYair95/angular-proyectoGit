import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { EscuelaService } from '../services/escuela.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-escuelas',
  templateUrl: './escuelas.component.html',
  styleUrls: ['./escuelas.component.css']
})
export class EscuelasComponent implements OnInit {

  constructor( 
    private escuelaService: EscuelaService,
    private authService: AuthService,
    private router: Router
    ) {

    let { nombre } = jwtDecode( sessionStorage.getItem('token') ) as any;
    
    this.escuelaService.buscarPorCct( nombre ).subscribe( resp =>{
      
      // algo salio mal
      if( resp === false ){
        this.authService.logout();
        this.router.navigateByUrl('/auth');
        return;
      }     
      
      sessionStorage.setItem( "usuario", JSON.stringify( resp ) );   
      return;

    });
   

   }

  ngOnInit(): void {
  }

}
