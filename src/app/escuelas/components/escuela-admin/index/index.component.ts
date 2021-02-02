import { Component, OnInit } from '@angular/core';
import { EscuelaService } from '../../../services/escuela.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor( private escuelaService : EscuelaService ) {
    
    
   }

  ngOnInit(): void {
  }

}
