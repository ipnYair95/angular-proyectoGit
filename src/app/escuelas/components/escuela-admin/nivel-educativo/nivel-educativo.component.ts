import { Component, OnInit } from '@angular/core';
import { EscuelaService } from '../../../services/escuela.service';
import { NivelService } from '../../../../nivel/services/nivel.service';
import { Cct } from '../../models/cct';
import { Nivel } from '../../../../nivel/entity/nivel';
import { Router } from '@angular/router';
import { NivelEscuela } from '../../models/relaciones';
import { RelacionEducativoService } from '../../../services/relacion-educativo.service';
import { forkJoin } from 'rxjs';
import { Carrera } from '../../../../nivel/entity/carrera';
import { CarreraService } from '../../../../nivel/services/carrera.service';
import { CicloEscolar } from '../../../../nivel/entity/cicloEscolar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoService } from '../../../services/grupo.service';
import { Grupo, GrupoAux } from '../../models/grupos';
import { Notificaciones, Opcion } from '../../../../ayudas/notificaciones';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-nivel-educativo',
  templateUrl: './nivel-educativo.component.html',
  styleUrls: ['./nivel-educativo.component.css']
})
export class NivelEducativoComponent implements OnInit {

  ////textos
  botonGrupo = "Crear";

  showGrupos = false;
  accion = false // false guardar - true editar
  grupoEditar : Grupo;

  nivelEscuela: NivelEscuela[];
  escuela: Cct;

  // pedidos de api
  niveles: Nivel[] = [];
  modalidades: Carrera[] = [];
  ciclosEscolares: CicloEscolar[] = [];

  // seleccion ciclo
  cicloSelected: CicloEscolar;
  gruposCicloActual: GrupoAux[] = [];
  forma: FormGroup;


  //tabla de grupos actuales
  displayedColumns: string[] = ['index', 'grupo', 'grado', 'salon', 'editar', 'eliminar'];
  dataSource;

  constructor(
    private nivelService: NivelService,
    private modalidadService: CarreraService,
    private router: Router,
    private escuelaService: EscuelaService,
    private relacionService: RelacionEducativoService,
    private grupoService: GrupoService,
    private fb: FormBuilder
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
    this.dataSourceModify();

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



  ///// crear grupos

  dataSourceModify() {

    let grupoTemporal: GrupoAux;

    this.gruposCicloActual = [];

    this.escuela.salones.forEach(salon => {
      if (salon.grupos.length) {
        //this.gruposCicloActual.push( salon.grupos.find( grupo => grupo.idCicloEscolar == this.cicloSelected.id ) );
        grupoTemporal = salon.grupos.find(grupo => grupo.idCicloEscolar == this.cicloSelected.id) as any;
        grupoTemporal.nombreGrado = this.cicloSelected.grados.find(grado => grupoTemporal.idGrado == grado.id).nombreGrado.toUpperCase();
        this.gruposCicloActual.push(grupoTemporal);
      }
    });

    this.dataSource = new MatTableDataSource(this.gruposCicloActual);
  }

  crearGrupos() {
    this.showGrupos = !this.showGrupos;
    this.crearFormulario();

  }

  crearFormulario() {
    this.forma = this.fb.group({
      id: [''],
      idGrado: ['',[Validators.required] ],
      idCicloEscolar: [this.cicloSelected.id, [Validators.required] ],
      nombreGrupo: ['', [ Validators.required , Validators.pattern("^[1-9][A-Z]$")]],
      salon: ['',[Validators.required] ],
    });
  }

  crearGrupo() {

    let grupo; 

    if( !this.forma.valid ){
        Notificaciones.enviarNotificacion( Opcion.errorCustom, "Campos no validos" );
        return;
    }    

    if( !this.accion ){
      
      grupo = this.forma.value;
      this.grupoService.crear( grupo.salon.id , grupo ).subscribe( resp =>{
        this.escuela.salones.find( salon => salon.id == grupo.salon.id ).grupos.push( resp );
        this.dataSourceModify();
        Notificaciones.enviarNotificacion( Opcion.exitoCustom, "Grupo creado" );
        this.showGrupos = false;
      });  

    }else{

      grupo = this.forma.value;
      console.log( grupo );

      this.escuela.salones.find(salon => this.grupoEditar.salon.id == salon.id).grupos
      = this.escuela.salones.find(salon => this.grupoEditar.salon.id == salon.id).grupos
        .filter(grupoAc => this.grupoEditar.id != grupoAc.id);

        this.grupoService.editar( grupo ).subscribe( resp =>{
          this.escuela.salones.find( salon => salon.id == grupo.salon.id ).grupos.push( resp );
          this.dataSourceModify();
          Notificaciones.enviarNotificacion( Opcion.exitoCustom, "Grupo editado" );
          this.showGrupos = false;
        });
       
    }


  }

  editar(grupoAux: GrupoAux) {


    this.showGrupos = true;
    this.accion = true;
    this.grupoEditar = grupoAux;    

    let salonSelect = this.escuela.salones.find(salon => salon.id == grupoAux.salon.id);

    this.forma = this.fb.group({
      id: [grupoAux.id],
      idGrado: [grupoAux.idGrado],
      idCicloEscolar: [grupoAux.idCicloEscolar],
      nombreGrupo: [grupoAux.nombreGrupo, [Validators.pattern("^[1-9][A-Z]$")]],
      salon: [ salonSelect ]
    });

    //console.log(this.forma.value);

  }

  eliminar(grupo: Grupo) {

    console.log( this.escuela.salones );
    this.grupoService.elmiinar(grupo.id).subscribe(resp => {

      
      this.escuela.salones.find(salon => grupo.salon.id == salon.id).grupos
        = this.escuela.salones.find(salon => grupo.salon.id == salon.id).grupos
          .filter(grupoAc => grupo.id != grupoAc.id);

      console.log( this.escuela.salones );
      this.dataSourceModify();
      Notificaciones.enviarNotificacion(Opcion.exitoCustom, "Grupo eliminado");
      this.showGrupos = false;
    });

  }

  getValidity(campo: string) {
    return this.forma.get(`${campo}`).invalid && this.forma.get(`${campo}`).touched
  }

  sort(model: Grupo[], atributo: number) {
    return model.sort((a, b) => (a[atributo] > b[atributo] ? 1 : a[atributo] === b[atributo] ? atributo : -1));
  }

}