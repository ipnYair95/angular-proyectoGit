import { Component, OnInit } from '@angular/core';
import { CicloEscolar } from '../../../../nivel/entity/cicloEscolar';
import { GrupoAux, Grupo } from '../../models/grupos';
import { EscuelaService } from '../../../services/escuela.service';
import { Cct } from '../../models/cct';
import { Router } from '@angular/router';
import { Historial } from '../../../../alumnos/entity/historial';
import { HistorialService } from '../../../../alumnos/services/historial.service';
import { MatTableDataSource } from '@angular/material/table'; 
import { Notificaciones, Opcion } from 'src/app/ayudas/notificaciones';
import { MatDialog } from '@angular/material/dialog';
import { CambioGrupoComponent } from './cambio-grupo/cambio-grupo.component';
import { AlumnoService } from '../../../../alumnos/services/alumno.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {

  title = "Ver grupos";
  cicloSelected: CicloEscolar;
  escuela: Cct;

  // grupos actuales
  gruposCicloActual: GrupoAux[];
  grupoSeleccionado: Grupo;

  //alumnos en el grupo
  alumnosEnGrupo: Historial[];

  // tabla
  columnas: string[] = ['index', 'nombre', 'curp', 'baja', 'ver','pdf','cambio'];
  dataSource;


  constructor(
    private escuelaService: EscuelaService,
    private router: Router,
    private historialService: HistorialService,
    private dialog: MatDialog,
    private as: AlumnoService
    ) {
    if (this.escuelaService.validaUsuario()) {

      const id = (JSON.parse(sessionStorage.getItem('usuario')) as Cct).id;
      this.escuelaService.buscarPodId(id).subscribe(resp => {
        this.escuela = resp;        
      });

    } else {
      this.router.navigateByUrl("../index");
    }
  }

  ngOnInit(): void {
  }

  cicloSelectedEvent(event: CicloEscolar) {
    this.cicloSelected = event;
    this.buscarGruposByCicloEscolar();
  }

  buscarGruposByCicloEscolar() {

    let grupoTemporal: GrupoAux;

    this.gruposCicloActual = [];

    this.escuela.salones.forEach(salon => {
      if (salon.grupos.length) {
        grupoTemporal = salon.grupos.find(grupo => grupo.idCicloEscolar == this.cicloSelected.id) as any;
        grupoTemporal.nombreGrado = this.cicloSelected.grados.find(grado => grupoTemporal.idGrado == grado.id).nombreGrado.toUpperCase();
        this.gruposCicloActual.push(grupoTemporal);
      }
    });

    //console.log(this.gruposCicloActual);

  }

  grupoSeleccionadoEvent(idGrupo: number) {

    this.grupoSeleccionado = this.gruposCicloActual.find( grupo => grupo.id == idGrupo );

    this.historialService.listarAlumnosByGrupo(idGrupo).subscribe(resp => {
      this.alumnosEnGrupo = resp;
      this.dataSource = this.setData();
    });

  }

  /// acciones alumnos

  baja(historial: Historial) {    

    Notificaciones.enviarNotificacion(Opcion.confirma, `Dar de baja al alumno ${historial.alumno.nombre} `).then(resp => {

      if (resp === 1) {        
        this.historialService.bajaAlumno( historial ).subscribe( resp =>{
        });
      } else {
        
      }

    });


  }

  documento( idAlumno: number ){
    this.as.descargarFichaAlumno( idAlumno.toString() ).subscribe( resp =>{      
      saveAs( new Blob([resp], {type:  'application/pdf'  } ) , 'alumnoInformacion' )
    });
  }

  openDialog( alumnoSeleccionado: Historial ) {



    const dialogRef = this.dialog.open( CambioGrupoComponent , {
      width: '40%',
      data: {
        historial: alumnoSeleccionado,
        grupos: this.gruposCicloActual.filter( grupo => grupo.id != this.grupoSeleccionado.id  ),
        grupoActual: this.grupoSeleccionado.nombreGrupo
      }
    });

    dialogRef.afterClosed().subscribe(result => {      
      
      if( result === true ){        
        this.alumnosEnGrupo = this.alumnosEnGrupo.filter( alumno => alumno.id != alumnoSeleccionado.id );
        this.dataSource = this.setData();
      }

    });
  }

  setData(){
    return new MatTableDataSource(this.sort( this.alumnosEnGrupo.filter(resp => resp.estaActivo == true)  ));
  }

  sort(model: Historial[]) {
    return model.sort((a, b) => (a.alumno.curp > b.alumno.curp ? 1 : a.alumno.curp === b.alumno.curp ? 0 : -1));
  }

  sortGrupos( model: Grupo[] ){

    return  model.sort( (a ,b ) => (a.nombreGrupo > b.nombreGrupo ? 1 : a.nombreGrupo === b.nombreGrupo ? 0 : -1));
  }

}
