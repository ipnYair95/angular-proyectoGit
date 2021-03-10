import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  tipoUsuario: string;

  constructor( private authService: AuthService) {
    
    this.tipoUsuario = this.authService.tipoUsuario;
    console.log(this.tipoUsuario);
     
   }

  ngOnInit(): void {
  }

}
