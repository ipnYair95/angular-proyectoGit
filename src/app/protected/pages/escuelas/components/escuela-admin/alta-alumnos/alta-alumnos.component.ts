import { Component, OnInit, Output } from '@angular/core';
import { AlumnoService } from '../../../../alumnos/services/alumno.service';
import { Alumno } from '../../../../alumnos/entity/alumno';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  
import { HistorialService } from '../../../../alumnos/services/historial.service'; 
import { Historial } from '../../../../alumnos/entity/historial';
import { GradoService } from '../../../../nivel/services/grado.service';
import { EscuelaService } from '../../../services/escuela.service';
import { Cct } from '../../models/cct';
import { Router } from '@angular/router';
import { Grupo, GrupoAux } from '../../models/grupos'; 
import { CicloEscolar } from '../../../../nivel/entity/cicloEscolar';
import { GrupoService } from '../../../services/grupo.service'; 
import { MatTableDataSource } from '@angular/material/table'; 
import { DatePipe } from '@angular/common';
import { Notificaciones, Opcion } from 'src/app/ayudas/notificaciones';

@Component({
  selector: 'app-alta-alumnos',
  templateUrl: './alta-alumnos.component.html',
  styleUrls: ['./alta-alumnos.component.css']
})
export class AltaAlumnosComponent implements OnInit {

  title = "Alta de alumnos"; 
  cicloSelected : CicloEscolar;

  escuela: Cct;

  alumno: Alumno;
  forma: FormGroup;
  alumnoHistorial: AlumnoHistorial = new AlumnoHistorial();
  ultimoRegistro : Historial; // ultimo estado del alumno

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
  gruposCicloActual : GrupoAux[] = [];
 


  //tabla de grupos actuales
  displayedColumnsGrupo: string[] = ['index', 'grupo', 'grado', 'salon', 'editar', 'eliminar'];
  dataSourceGrupo;



  constructor(
    private alumnoService: AlumnoService,
    private historialService: HistorialService, 
    private gradoService: GradoService,
    private escuelaService: EscuelaService,
    private grupoService: GrupoService, 
    private router: Router,
    private datePipe: DatePipe,
    private fb: FormBuilder) {

    if (this.escuelaService.validaUsuario()) {

      const id = (JSON.parse(sessionStorage.getItem('usuario')) as Cct).id;
      this.escuelaService.buscarPodId(id).subscribe(resp => {
        this.escuela = resp;
        console.log(this.escuela); 
      });

    } else {
      this.router.navigateByUrl("../index");
    }

  }

  crearFormulario() {
    this.forma = this.fb.group({
      curp: ['', [Validators.required, Validators.pattern('^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$')]],
    });
  }

  ngOnInit(): void {
  }

  cicloSelectedEvent( event : CicloEscolar ){
    this.cicloSelected = event;
    this.dataSourceModify();
  }

  enviar() {

    if (this.forma.valid) {

      this.alumnoService.buscarPorCurp(this.forma.get('curp').value).subscribe((resp ) => {

        if( resp == false ){
          Notificaciones.enviarNotificacion( Opcion.errorCustom, `Alumno no encontrado` );
          return;
        }

        //console.log(resp);
        Notificaciones.enviarNotificacion(Opcion.exitoCustom, `Alumno encontrado`);
        this.alumno = resp;
        const nombreCompleto = resp.apePaterno.toUpperCase() + " " + resp.apeMaterno.toUpperCase() + " " + resp.nombre.toUpperCase();
        this.alumnoHistorial.curp = resp.curp;
        this.alumnoHistorial.nombreCompleto = nombreCompleto;

        if (this.alumno.historiales.length > 0) {
          this.filtrarHistorial();
        } else {
          // no tiene historial
          this.alumnoHistorial.curp = resp.curp;
          this.alumnoHistorial.nombreCompleto = nombreCompleto;
          this.alumnoHistorial.ultimoGrado = "NO EXISTE";
          this.alumnoHistorial.ultimoNivel = "NO EXISTE";
          this.alumnoHistorial.ultimaEscuela = "NO EXISTE";
          this.dataSource = new MatTableDataSource([this.alumnoHistorial]);
        }

      }, (err) => {
        Notificaciones.enviarNotificacion(Opcion.errorCustom, 'Alumno no encontrado');
      });

    } else {
      Notificaciones.enviarNotificacion(Opcion.errorCustom, "Existen errores en los campos");
    }

  }

  filtrarHistorial() {

    this.ultimoRegistro = this.sortByDate(this.alumno.historiales)[0];

    let fechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let ultimoGrupo : Grupo;

    if (
      this.compararFechas(new Date(fechaActual), new Date(this.cicloSelected.fechaInicio)) == 1
      ||
      this.compararFechas(new Date(fechaActual), new Date(this.cicloSelected.fechaTermino)) == -1
    ) {
      Notificaciones.enviarNotificacion(Opcion.errorCustom, "El registro debe ser dentro del periodo");
      return;
    }

    this.grupoService.buscar(this.ultimoRegistro.idGrupo).subscribe(resp => {

      ultimoGrupo = resp;

      this.gradoService.buscarPorId( ultimoGrupo.idGrado ).subscribe( resp =>{        

        this.alumnoHistorial.ultimoGrado = resp.nombreGrado; 
        this.alumnoHistorial.ultimoNivel = resp.cicloEscolar.nombreCiclo;
        this.alumnoHistorial.ultimaModalidad = resp.cicloEscolar.carrera.nombreCarrera;
        this.alumnoHistorial.ultimoNivel = resp.cicloEscolar.carrera.nivel.nombreNivel;        
        this.alumnoHistorial.estado = this.ultimoRegistro.estaActivo;

        this.grupoService.buscar( this.ultimoRegistro.idGrupo ).subscribe( resp =>{
          console.log(resp);
          this.alumnoHistorial.idEscuela = resp.salon.centroDeTrabajo.id;
          this.alumnoHistorial.ultimaEscuela = resp.salon.centroDeTrabajo.cct + " " + resp.salon.centroDeTrabajo.nombre;
          this.dataSource = new MatTableDataSource( [this.alumnoHistorial] );
        });


      });



      //esta dentro del ciclo -> cambio de escuela
      if (
        this.compararFechas(this.ultimoRegistro.fechaAlta, new Date(this.cicloSelected.fechaInicio)) == -1
        &&
        this.compararFechas(this.ultimoRegistro.fechaAlta, new Date(this.cicloSelected.fechaTermino)) == 1
      ) {

        console.log("Dentro del ciclo");
      }

      //this.inscribirDesdeCero();
    });




  }

  inscribir() {

    if (this.grupoSeleccionado === undefined) {
      Notificaciones.enviarNotificacion(Opcion.errorCustom, "Debe seleccionar un grupo");
      return;
    }

    this.forma.reset();
    this.dataSource = null;

    if (this.alumno.historiales.length == 0) {
      this.inscribirDesdeCero();
    }else if( this.alumnoHistorial.idEscuela == this.escuela.id ){
      Notificaciones.enviarNotificacion( Opcion.errorCustom, "El alumno ya se encuentra en la CCT" );      
    }else if( this.alumnoHistorial.estado == true ){
      Notificaciones.enviarNotificacion( Opcion.errorCustom, `El alumno debe ser dado de baja de la CCT: ${this.alumnoHistorial.ultimaEscuela}` );      
    }else {
      
      this.ultimoRegistro.idGrupo = this.grupoSeleccionado.id;
      this.ultimoRegistro.estaActivo = true;
      this.ultimoRegistro.alumno = null;
      
      console.log( this.ultimoRegistro );
      this.historialService.cambioDeEscuela( this.ultimoRegistro  ).subscribe( resp =>{
        console.log(resp);
      }, (err) => console.log(err));

    }


  }

  inscribirDesdeCero() {
    

    let nuevoHistorial: Historial = new Historial();
    nuevoHistorial.idGrupo = this.grupoSeleccionado.id;
    nuevoHistorial.estaActivo = true;

    console.log(nuevoHistorial);

    this.historialService.asignarHistorial(this.alumno.id, nuevoHistorial).subscribe(resp => {
      Notificaciones.enviarNotificacion(Opcion.exitoCustom, "Alumno asignado con exito");
    });


  }

  sortByDate(historiales: Historial[]) {
    return historiales.sort((a, b) => this.compararFechas(a.fechaAlta, b.fechaAlta));
  }

  /**
   * primero el menor
   */
  compararFechas(fecha1: Date, fecha2: Date): number {

    let d1 = new Date(fecha1);
    let d2 = new Date(fecha2);

    let same = d1.getTime() === d2.getTime();

    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return -1;

    // Check if the first is less than second
    if (d1 < d2) return 1;
  }

  ///////////////////// 

  selectGrupo(grupoSeleccionado: Grupo) {

    console.log(grupoSeleccionado);
    this.grupoSeleccionado = grupoSeleccionado;
    this.existeSeleccion = !this.existeSeleccion;

  } 
 
  dataSourceModify() {

    let grupoTemporal: GrupoAux;

    this.gruposCicloActual = [];

    this.escuela.salones.forEach(salon => {
      if (salon.grupos.length) {
        grupoTemporal = salon.grupos.find(grupo => grupo.idCicloEscolar == this.cicloSelected.id) as any;
        grupoTemporal.nombreGrado = this.cicloSelected.grados.find(grado => grupoTemporal.idGrado == grado.id).nombreGrado.toUpperCase();
        this.gruposCicloActual.push(grupoTemporal);
      }
    });

    this.crearFormulario();

    this.dataSourceGrupo = new MatTableDataSource(this.sortByGrupo(this.gruposCicloActual));
  }

  getValidity(campo: string) {
    return this.forma.get(`${campo}`).invalid && this.forma.get(`${campo}`).touched
  }

  sortByGrupo(grupos: GrupoAux[]) {
    return grupos.sort((a, b) => (a.nombreGrupo > b.nombreGrupo ? 1 : a.nombreGrupo === b.nombreGrupo ? 0 : -1));
  }

  sort(model: any) {
    return model.sort((a, b) => (a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1));
  }

}




export class AlumnoHistorial {

  curp: string;
  nombreCompleto: string;

  ultimoNivel: string;
  ultimoGrado: string;
  ultimaModalidad: string;
  ultimoCicloEscolar: string;

  ultimaEscuela: string;

  estado: boolean;
  idEscuela: number;

}
