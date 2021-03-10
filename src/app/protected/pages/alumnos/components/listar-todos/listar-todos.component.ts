import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../entity/alumno';
import { AlumnoService } from '../../services/alumno.service';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-listar-todos',
  templateUrl: './listar-todos.component.html',
  styleUrls: ['./listar-todos.component.css']
})
export class ListarTodosComponent implements OnInit {

  alumnos: Alumno[] = [];

  constructor( private as: AlumnoService ) { }

  ngOnInit(): void {

    this.as.listar().subscribe( resp =>{
      //console.log(resp);
      this.alumnos = resp;
    });

  }

  sortBy(prop: string) {
    return this.alumnos.sort( (a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  descargarReporte( ){

    this.as.descargarListaPdf(  ).subscribe( resp =>{      
      saveAs( new Blob([resp], {type:  'application/pdf'  } ) , 'alumnos' )
    });

  }

  descargarReporteAlumno( id : String ){

    this.as.descargarFichaAlumno( id ).subscribe( resp =>{      
      saveAs( new Blob([resp], {type:  'application/pdf'  } ) , 'alumnoInformacion' )
    });

  }


}
