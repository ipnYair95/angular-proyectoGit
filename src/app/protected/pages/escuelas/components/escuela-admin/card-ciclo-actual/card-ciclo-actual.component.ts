import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Cct } from '../../models/cct';
import { Alumno } from '../../../../alumnos/entity/alumno';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Historial } from '../../../../alumnos/entity/historial';
import { Grupo, GrupoAux } from '../../models/grupos';
import { NivelEscuela } from '../../models/relaciones';
import { Nivel } from '../../../../nivel/entity/nivel';
import { Carrera } from '../../../../nivel/entity/carrera';
import { CicloEscolar } from '../../../../nivel/entity/cicloEscolar';
import { NivelService } from '../../../../nivel/services/nivel.service';
import { EscuelaService } from '../../../services/escuela.service';
import { RelacionEducativoService } from '../../../services/relacion-educativo.service';
import { CarreraService } from '../../../../nivel/services/carrera.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AlumnoHistorial } from '../alta-alumnos/alta-alumnos.component';

@Component({
  selector: 'app-card-ciclo-actual',
  templateUrl: './card-ciclo-actual.component.html',
  styleUrls: ['./card-ciclo-actual.component.css']
})
export class CardCicloActualComponent implements OnInit {

  escuela: Cct;

  alumno: Alumno;
  forma: FormGroup;
  alumnoHistorial: AlumnoHistorial = new AlumnoHistorial();
  ultimoRegistro: Historial; // ultimo estado del alumno

  displayedColumns: string[] = ['curp', 'nombre', 'nivel', 'grado', 'escuela', 'estado'];
  dataSource;

  /// control de checkbox

  existeSeleccion = false;
  grupoSeleccionado: Grupo;

  ////////////////////////////

  ////textos
  botonGrupo = "Crear";

  showGrupos = false;
  accion = false // false guardar - true editar
  grupoEditar: Grupo;

  nivelEscuela: NivelEscuela[];

  // pedidos de api
  niveles: Nivel[] = [];
  modalidades: Carrera[] = [];
  ciclosEscolares: CicloEscolar[] = [];

  // seleccion ciclo
  cicloSelected: CicloEscolar;
  gruposCicloActual: GrupoAux[] = [];

  @Input()
  title: string;

  @Output()
  onCicloSelected: EventEmitter<CicloEscolar> = new EventEmitter();


  //tabla de grupos actuales
  displayedColumnsGrupo: string[] = ['index', 'grupo', 'grado', 'salon', 'editar', 'eliminar'];
  dataSourceGrupo;



  constructor(
    private nivelService: NivelService,
    private escuelaService: EscuelaService,
    private relacionService: RelacionEducativoService,
    private modalidadService: CarreraService,
    private router: Router
  ) {

    if (this.escuelaService.validaUsuario()) {

      const id = (JSON.parse(sessionStorage.getItem('usuario')) as Cct).id;
      this.escuelaService.buscarPodId(id).subscribe(resp => {
        this.escuela = resp;
        console.log(this.escuela);
        this.getInfoNiveles();
      });

    } else {
      this.router.navigateByUrl("../index");
    }

  }


  ngOnInit(): void {
  }


  /////////////////////


  cambioNivel(idNivel) {

    let observableData = [];
    let nivelEscuela = this.nivelEscuela.find(ele => ele.idNivel == idNivel);

    nivelEscuela.modalidades.forEach(modalidad => {
      observableData.push(this.modalidadService.buscarPorId(modalidad.idModalidad));
    });

    forkJoin(observableData).subscribe((resp: any) => {
      this.modalidades = resp;
      //console.log(this.modalidades);
    });

  }

  cambioModalidad(idModalidad) {

    let modalidad = this.modalidades.find(ele => ele.id = idModalidad);
    this.ciclosEscolares = modalidad.ciclosEscolares;

  }

  cambioCiclo(idCiclo) {

    this.cicloSelected = this.ciclosEscolares.find(ele => ele.id == idCiclo);
    this.onCicloSelected.emit(this.cicloSelected);
  }


  getInfoNiveles() {


    this.relacionService.getNiveles(this.escuela.id).subscribe(resp => {
      this.nivelEscuela = resp;
      this.initNiveles();
    });

  }

  initNiveles() {

    let observableData = [];

    if (this.nivelEscuela.length > 0) {

      this.nivelEscuela.forEach(relacion => {
        observableData.push(this.nivelService.buscarPorId(relacion.idNivel));
      });

      forkJoin(observableData).subscribe((resp: any) => {
        this.niveles = resp;
        //console.log(this.niveles);
      });


    } else {
      //console.log("No existen niveles asignados");
    }

  }
 
}


