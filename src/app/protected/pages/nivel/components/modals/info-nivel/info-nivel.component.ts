import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Nivel } from '../../../entity/nivel';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NivelService } from '../../../services/nivel.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-nivel',
  templateUrl: './info-nivel.component.html',
  styleUrls: ['./info-nivel.component.css']
})
export class InfoNivelComponent implements OnInit {

  titulo = 'Carrera';

  forma: FormGroup;

  @Input()
  nivel: Nivel;

  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private ns: NivelService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {    
    this.validarId();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombreNivel: ['', Validators.required],
      jerarquia: ['', Validators.required]
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

      this.nivel.nombreNivel = this.forma.value.nombreNivel;
      this.nivel.jerarquia = this.forma.value.jerarquia;


      if (this.nivel.id) {
        this.ns.editar(this.nivel, this.nivel.id).subscribe(
          (resp) => {
            Swal.fire(
              'Exito',
              `Nivel ${this.nivel.nombreNivel} editado`,
              'success'
            );
            this.activeModal.close( 'editar' );
          },
          (err) => {
            Swal.fire('Error', 'Ha ocurrido un error', 'error');
          }
        );
      } else {
        this.ns.agregar(this.nivel).subscribe(
          (resp : Nivel) => {
            Swal.fire(
              'Exito',
              `Nivel ${this.nivel.nombreNivel} creado`,
              'success'
            );
            this.nivel.id = resp.id;
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
      title: '¿Eliminar nivel?',
      text: ` Eliminar el nivel ${this.nivel.nombreNivel} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.ns.eliminar(this.nivel.id).subscribe(
            (resp) => {
              Swal.fire('Deleted!', 'Nivel eliminado.', 'success');
              this.activeModal.close( 'eliminar' );              
            },
            (err) => {}
          );
        }
      })
      .catch((err) => {
        Swal.fire('Error', 'Ha ocurrido un error', 'error');
      });

      //this.router.navigate(['/nivel/listar']);

  }

  /**
   * Saber si se va editar o no para poblar
   */
  validarId() {
    console.log(this.nivel.id);
    if (this.nivel.id) {
      this.forma.reset({
        nombreNivel: this.nivel.nombreNivel,
        jerarquia: this.nivel.jerarquia
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
