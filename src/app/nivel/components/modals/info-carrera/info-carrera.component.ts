import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Nivel } from '../../../entity/nivel';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NivelService } from '../../../services/nivel.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Carrera } from '../../../entity/carrera';
import { CarreraService } from '../../../services/carrera.service';

@Component({
  selector: 'app-info-carrera',
  templateUrl: './info-carrera.component.html',
  styleUrls: ['./info-carrera.component.css'],
})
export class InfoCarreraComponent implements OnInit {
  
  titulo = 'Carrera';

  forma: FormGroup;

  @Input()
  carrera: Carrera;

  @Input()
  idNivel: number;

  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private ns: CarreraService,
    private router: Router
  ) {    
    this.crearFormulario();
  }

  ngOnInit(): void {    
    this.validarId();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombreCarrera: ['', Validators.required],
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
           
      this.carrera.nombreCarrera = this.forma.value.nombreCarrera

      if (this.carrera.id) {
        this.ns.editar( this.idNivel ,  this.carrera.id , this.carrera,  ).subscribe(
          (resp) => {
            Swal.fire(
              'Exito',
              `Carrera ${this.carrera.nombreCarrera} editado`,
              'success'
            );
            this.activeModal.close( 'editar' );
          },
          (err) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
          }
        );
      } else {
        this.ns.agregar( this.idNivel ,this.carrera).subscribe(
          (resp : Carrera) => {
            Swal.fire(
              'Exito',
              `Carrera ${this.carrera.nombreCarrera} creado`,
              'success'
            );
            this.carrera.id = resp.id;
            this.activeModal.close( 'crear' );
          },
          (err) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
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
      title: '¿Eliminar carrera?',
      text: ` Eliminar la carrera ${this.carrera.nombreCarrera} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.ns.eliminar( this.idNivel, this.carrera.id ).subscribe(
            (resp) => {
              Swal.fire('Deleted!', 'Carrera eliminada.', 'success');
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
    console.log( this.carrera.nombreCarrera );
    if (this.carrera.id) {
      this.forma.reset({
        nombreCarrera: this.carrera.nombreCarrera
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
