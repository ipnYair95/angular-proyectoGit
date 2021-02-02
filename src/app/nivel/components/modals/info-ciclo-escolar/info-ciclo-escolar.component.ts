import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CicloEscolar } from '../../../entity/cicloEscolar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CicloEscolarService } from '../../../services/ciclo-escolar.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-info-ciclo-escolar',
  templateUrl: './info-ciclo-escolar.component.html',
  styleUrls: ['./info-ciclo-escolar.component.css']
})
export class InfoCicloEscolarComponent implements OnInit {

  titulo = 'Ciclo Escolar';

  forma: FormGroup;

  @Input()
  cicloEscolar: CicloEscolar;

  @Input()
  idCarrera: number;

  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private cicloService: CicloEscolarService,
    private router: Router
  ) {    
    this.crearFormulario();
  }

  ngOnInit(): void {  
    console.log(  this.idCarrera );  
    console.log(  this.cicloEscolar );  
    this.validarId();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombreCiclo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaTermino: ['', Validators.required]
    });
  }

  /**
   * Validacion de campos del form group
   * @param campo Campo a validar que contiene forma
   */
  campoInvalido(campo: String) {
    return (
      this.forma.get(`${campo}`).invalid && this.forma.get(`${campo}`).touched
    );
  }

  enviar() {
    if (this.forma.valid) {
           
      this.cicloEscolar.nombreCiclo = this.forma.value.nombreCiclo

      const inicioInput = new DatePipe('en-US').transform(this.forma.value.fechaInicio, 'yyyy-MM-dd')
      this.cicloEscolar.fechaInicio = inicioInput;

      const terminoInput = new DatePipe('en-US').transform(this.forma.value.fechaTermino, 'yyyy-MM-dd')
      this.cicloEscolar.fechaTermino = terminoInput;

      console.log( "id nivel -> " + this.idCarrera );
      console.log( this.cicloEscolar );

      if (this.cicloEscolar.id) {
        this.cicloService.editar( this.idCarrera ,  this.cicloEscolar.id , this.cicloEscolar,  ).subscribe(
          (resp) => {
            Swal.fire(
              'Exito',
              `Ciclo escolar ${this.cicloEscolar.nombreCiclo} editado`,
              'success'
            );
            this.activeModal.close( 'editar' );
          },
          (err) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
            console.log(err);
          }
        );
      } else {
        this.cicloService.agregar( this.idCarrera ,this.cicloEscolar).subscribe(
          (resp : CicloEscolar) => {
            Swal.fire(
              'Exito',
              `CicloEscolar ${this.cicloEscolar.nombreCiclo} creado`,
              'success'
            );
            this.cicloEscolar.id = resp.id;
            this.activeModal.close( 'crear' );
          },
          (err) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');            
            console.log( err );
          }
        );
      }
    } else {
      if (this.forma.invalid) {
        this.marcarInvalidos();
      }
      
    }
    
  }

  eliminar() {
    
    Swal.fire({
      title: '¿Eliminar ciclo escolar?',
      text: ` Eliminar el ciclo escolar: ${this.cicloEscolar.nombreCiclo} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.cicloService.eliminar( this.idCarrera, this.cicloEscolar.id ).subscribe(
            (resp) => {
              Swal.fire('Deleted!', 'Ciclo escolar eliminado.', 'success');
              this.activeModal.close( 'eliminar' );              
            },
            (err) => {}
          );
        }
      })
      .catch((err) => {
        Swal.fire('Error', 'Ha ocurrido un error', 'error');
      });

  }

  /**
   * Saber si se va editar o no para poblar
   */
  validarId() {    
    console.log( this.cicloEscolar.nombreCiclo );
    if (this.cicloEscolar.id) {
      this.forma.reset({
        nombreCiclo: this.cicloEscolar.nombreCiclo,
        fechaInicio: this.cicloEscolar.fechaInicio,
        fechaTermino: this.cicloEscolar.fechaTermino
      });
    }
    
  }

  marcarInvalidos() {
    return Object.values(this.forma.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((control) =>
          control.markAsTouched()
        );
      } else {
        control.markAsTouched();
      }
    });
  }

}
