import { Component, OnInit } from '@angular/core';
import { EscuelaService } from '../../../services/escuela.service';
import { CicloEscolar } from '../../../../nivel/entity/cicloEscolar';
import { ExternosService } from '../../../../../../services/externos.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  cicloSelected : CicloEscolar;
  title = "Alta de alumnos"

  constructor(  ) {
    
   
   }

  ngOnInit(): void {
  }

 
}