import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tutor } from '../../../entity/tutor';
import { ValidadoresService } from '../../../../services/validadores.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css'],
})
export class TutorComponent implements OnInit {
  titulo = 'Tutor del alumno';

  nacimiento = 'valor';
  sexo = 'valor';

  forma: FormGroup;

  @Input() 
  tutor: Tutor;
  
  @Output() 
  passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private validadoresService: ValidadoresService
  ) {
    this.crearFormulario();
    this.listener();
    
  }

  ngOnInit(): void {
    console.log( this.tutor );    
    this.validarId();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre: ['', Validators.required],
      apePaterno: ['', Validators.required],
      apeMaterno: ['', Validators.required],
      curp: ['', [Validators.required,  Validators.pattern( '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$') ]],
      parentesco: ['', Validators.required],
      ocupacion: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      telefono: ['',[Validators.required, Validators.pattern('^([0-9]|-)*$')  ]]
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

  // para llenar los campos deshabilitados
  listener() {
    this.forma.get('curp').valueChanges.subscribe((valor) => {
      if (!this.campoInvalido('curp')) {
        console.log('valido');
        //asignamos el sexo dada la curp
        this.sexo = valor[10] === 'H' ? 'Hombre' : 'Mujer';
        //asignamos la fecha de nacimiento data la curp
        this.nacimiento = this.obtenerFecha(valor);
      }
    });
  }

   //evento para omitir campos de domicilio
   marcarResponsable(event: any) {    
    this.tutor.esResponsable = event.currentTarget.checked; // obtenemos el chekcbox
  }

  /**
   * Obtiene la fecha de nacimiento en formato yyyy/mm/dd
   * @param curp
   */
  obtenerFecha(curp: string): string {
    let dia = curp.substring(8, 10);
    let mes = curp.substring(6, 8);
    let anio = curp.substring(4, 6);

    let actual = new Date();
    let comparacion = new Date().getFullYear().toString().substring(2, 4);

    // 90 > 21 -> 1900
    if (anio >= comparacion) {
      return `19${anio}-${mes}-${dia}`;
    }

    return `20${anio}-${mes}-${dia}`;
  }

  passBack() {
    if (this.forma.valid) {
      
      this.tutor.nombre = this.forma.value.nombre;
      this.tutor.apePaterno = this.forma.value.apePaterno;
      this.tutor.apeMaterno = this.forma.value.apeMaterno;

      this.tutor.curp = this.forma.value.curp;
      this.tutor.fechaNacimiento = new Date(this.nacimiento);
      this.tutor.sexo = this.sexo;

      this.tutor.parentesco = this.forma.value.parentesco;
      this.tutor.ocupacion = this.forma.value.ocupacion;
      this.tutor.edoCivil = this.forma.value.estadoCivil;

      this.tutor.email = this.forma.value.email;
      this.tutor.telefono = this.forma.value.telefono;

      this.passEntry.emit(this.tutor);
      this.activeModal.close(this.tutor);
      //console.log( this.tutor );
    } else {
      if (this.forma.invalid) {
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
  }

  /**
   * Saber si se va editar o no para poblar
   */
  validarId(){
    
    //console.log( this.tutor.curp );
    if( this.tutor.curp ){
      this.forma.reset({
        nombre: this.tutor.nombre,
        apePaterno: this.tutor.apePaterno,
        apeMaterno: this.tutor.apeMaterno,
        curp: this.tutor.curp,
        parentesco: this.tutor.parentesco,
        ocupacion: this.tutor.ocupacion,
        estadoCivil: this.tutor.edoCivil,
        email: this.tutor.email,
        telefono: this.tutor.telefono,                  
      });
    }

  }

}
