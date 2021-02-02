import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../../../alumnos/services/alumno.service';
import { Alumno } from '../../../../alumnos/entity/alumno';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Notificaciones, Opcion } from '../../../../ayudas/notificaciones';
import { HistorialService } from '../../../../alumnos/services/historial.service';
import { NivelService } from '../../../../nivel/services/nivel.service';
import { forkJoin, Observable } from 'rxjs';
import { Nivel } from '../../../../nivel/entity/nivel';
import { Historial } from '../../../../alumnos/entity/historial';
import { GradoService } from '../../../../nivel/services/grado.service';
import { EscuelaService } from '../../../services/escuela.service';
import { Cct } from '../../models/cct';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-alumnos',
  templateUrl: './alta-alumnos.component.html',
  styleUrls: ['./alta-alumnos.component.css']
})
export class AltaAlumnosComponent implements OnInit {

  escuela: Cct;

  alumno: Alumno;
  forma: FormGroup;
  alumnoHistorial: AlumnoHistorial = new AlumnoHistorial();

  displayedColumns: string[] = ['curp', 'nombre', 'nivel','grado','escuela','estado'];
  dataSource;


  constructor(
    private alumnoService: AlumnoService,
    private historialService: HistorialService,
    private nivelService: NivelService,
    private gradoService: GradoService,
    private escuelaService: EscuelaService,  
    private router: Router,  
    private fb: FormBuilder) {

      if (this.escuelaService.validaUsuario()) {

        const id = (JSON.parse(sessionStorage.getItem('usuario')) as Cct).id;
        this.escuelaService.buscarPodId(id).subscribe(resp => {
  
          this.escuela = resp;
          console.log(this.escuela);
  
        })
  
      } else {
        this.router.navigateByUrl("../index");
      }

    this.crearFormulario();

  }

  crearFormulario() {
    this.forma = this.fb.group({
      curp: ['', [Validators.required, Validators.pattern('^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$')]],
    });
  }

  ngOnInit(): void {
  }

  campoInvalido(campo: String) {
    return (
      this.forma.get(`${campo}`).invalid && this.forma.get(`${campo}`).touched
    );
  }

  enviar() {

    if (this.forma.valid) {

      this.alumnoService.buscarPorCurp(this.forma.get('curp').value).subscribe((resp: Alumno) => {
        console.log(resp);
        //Notificaciones.enviarNotificacion( Opcion.exitoCustom, `Alumno encontrado` );
        this.alumno = resp;
        const nombreCompleto = resp.apePaterno.toUpperCase() + " " + resp.apeMaterno.toUpperCase() + " " + resp.nombre.toUpperCase();
        this.alumnoHistorial.curp = resp.curp;
        this.alumnoHistorial.nombreCompleto = nombreCompleto;
        this.alumnoHistorial.estado = this.alumno.inscritoEscuela;

        if (this.alumno.historiales.length > 0) {
          this.filtrarHistorial();
        } else {
          // no tiene historial
          this.alumnoHistorial.curp = resp.curp;
          this.alumnoHistorial.nombreCompleto = nombreCompleto;
          this.alumnoHistorial.ultimoGrado = "NO EXISTE";
          this.alumnoHistorial.ultimoNivel = "NO EXISTE";
          this.alumnoHistorial.ultimaEscuela = "NO EXISTE";
          this.dataSource = [this.alumnoHistorial];
        }

      }, (err) => {
        Notificaciones.enviarNotificacion(Opcion.errorCustom, 'Alumno no encontrado');
      });

    } else {
      Notificaciones.enviarNotificacion(Opcion.errorCustom, "Existen errores en los campos");
    }

  }

  filtrarHistorial() {

    let historialMayor = this.alumno.historiales[0];

    for (let i = 1; i < this.alumno.historiales.length; i++) {

      let valor: number = this.compararFechas(historialMayor.fechaAlta, this.alumno.historiales[i].fechaAlta);
      if (valor == 0) {
        console.log("iguales");
      } else if (valor == 1) {
        console.log("se mantiene mayor");
      } else {
        historialMayor = this.alumno.historiales[i];
        console.log("cambio");
      }

    }

    console.log( historialMayor );

    this.nivelService.buscarPorId(historialMayor.idNivel).subscribe(resp => {
      this.alumnoHistorial.ultimoNivel = resp.nombreNivel.toUpperCase();
      this.gradoService.buscarPorId(historialMayor.idGrado).subscribe(resp => {
        this.alumnoHistorial.ultimoGrado = resp.nombreGrado.toUpperCase();
        this.escuelaService.buscarPodId( historialMayor.idEscuela ).subscribe( resp =>{
          this.alumnoHistorial.ultimaEscuela = resp.cct + " " + resp.nombre;
          this.alumnoHistorial.cct = resp.cct;
          this.dataSource = [this.alumnoHistorial];
        });
      });
    });


  }

  inscribir(){   

    if(  this.alumnoHistorial.cct == this.escuela.cct ){
      console.log("no shive");
      Notificaciones.enviarNotificacion( Opcion.errorCustom, 'Alumno ya se encuentra en la CCT' );
    }else{

      if( !this.alumno.inscritoEscuela ){

        Notificaciones.enviarNotificacion( Opcion.exitoCustom, `${this.alumnoHistorial.nombreCompleto} ha sido inscrito` );
        
      }else{
        Notificaciones.enviarNotificacion( Opcion.errorCustom, 'Alumno debe ser dado de baja' );
      }

    }    

  }

  compararFechas(fecha1: Date, fecha2: Date): number {

    let d1 = new Date(fecha1);
    let d2 = new Date(fecha2);

    let same = d1.getTime() === d2.getTime();

    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

}




export class AlumnoHistorial {

  curp: string;
  nombreCompleto: string;
  ultimoNivel: string;
  ultimoGrado: string;
  ultimaEscuela: string;
  estado: boolean;
  cct: string;

}

/*
    let observableData = [];
    let nivelMayor = 0;


    this.alumno.historiales.forEach(historial => {
      console.log("envio, " , historial.idNivel);
      observableData.push( this.nivelService.buscarPorId( historial.idNivel ) );
    });

    forkJoin( observableData ).subscribe( resp =>{

      resp.forEach( ( nivel : Nivel ) =>{
        if( nivel.jerarquia > nivelMayor ){
          nivelMayor = nivel.jerarquia;
          this.alumnoHistorial.ultimoNivel = nivel.nombreNivel;

        }
      })

      this.dataSource = [ this.alumnoHistorial ];
      console.log("mayor " , nivelMayor);

    });
  */
 