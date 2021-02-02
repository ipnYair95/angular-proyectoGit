import { Component, OnInit } from '@angular/core';
import { Cct } from '../../../models/cct';
import { EscuelaService } from '../../../../services/escuela.service';

@Component({
  selector: 'app-index-crud',
  templateUrl: './index-crud.component.html',
  styleUrls: ['./index-crud.component.css']
})
export class IndexCrudComponent implements OnInit {

  escuelas: Cct[] = [];

  displayedColumns: string[] = ['index', 'CCT', 'nombre', 'editar','niveles'];
  dataSource;

  constructor( private escuelaService: EscuelaService ) {
    this.escuelaService.listar().subscribe( resp =>{
      this.escuelas = resp;
      this.dataSource = this.escuelas;
    });

   }

  ngOnInit(): void {
  }

 
  

}

