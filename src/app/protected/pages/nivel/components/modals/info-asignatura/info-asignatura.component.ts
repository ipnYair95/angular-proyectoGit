import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AsignaturaService } from '../../../services/asignatura.service'; 
import { Asignatura } from '../../../entity/asignatura';

@Component({
  selector: 'app-info-Asignatura',
  templateUrl: './info-Asignatura.component.html',
  styleUrls: ['./info-Asignatura.component.css']
})
export class InfoAsignaturaComponent implements OnInit {

  titulo = 'Ciclo Escolar';

  forma: FormGroup;

  @Input()
  asignatura: Asignatura;

  @Input()
  idGrado: number;

  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private asignaturaService: AsignaturaService
  ) {    
    this.crearFormulario();
  }

  ngOnInit(): void {  
    console.log(  this.idGrado );  
    console.log(  this.asignatura );  
    this.validarId();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombreAsignatura: ['', Validators.required] 
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
           
      this.asignatura.nombreAsignatura = this.forma.value.nombreAsignatura      
      console.log( this.asignatura );

      if (this.asignatura.id) {
        this.asignaturaService.editar( this.idGrado ,  this.asignatura.id , this.asignatura,  ).subscribe(
          (resp) => {
            Swal.fire(
              'Exito',
              `Asignatura ${this.asignatura.nombreAsignatura} editado`,
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
        this.asignaturaService.agregar( this.idGrado ,this.asignatura).subscribe(
          (resp : Asignatura) => {
            Swal.fire(
              'Exito',
              `Asignatura ${this.asignatura.nombreAsignatura} creado`,
              'success'
            );
            this.asignatura.id = resp.id;
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
      title: '¿Eliminar grado ?',
      text: ` Eliminar el grado: ${this.asignatura.nombreAsignatura} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.asignaturaService.eliminar( this.idGrado, this.asignatura.id ).subscribe(
            (resp) => {
              Swal.fire('Deleted!', 'Grado eliminado.', 'success');
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
    console.log( this.asignatura.nombreAsignatura );
    if (this.asignatura.id) {
      this.forma.reset({
        nombreAsignatura: this.asignatura.nombreAsignatura 
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
