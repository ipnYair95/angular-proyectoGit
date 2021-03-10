import {
  Component,
  OnInit 
} from '@angular/core';

import Swal from 'sweetalert2';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TutorComponent } from './tutor/tutor.component';

// Models


// Models extenos
import { Estado } from 'src/app/models-externos/estado';
import { Municipio } from 'src/app/models-externos/municipio';
import { CodigoPostal } from 'src/app/models-externos/codigo-postal';
import { Colonia } from 'src/app/models-externos/colonia';
 
// Services

import { ExternosService } from 'src/app/services/externos.service'; 
import { Alumno } from '../../alumnos/entity/alumno';
import { AlumnoService } from '../../alumnos/services/alumno.service';
import { Tutor } from '../../alumnos/entity/tutor';
import { Domicilio } from '../../alumnos/entity/domicilio';

@Component({
  selector: 'app-crear-alumno',
  templateUrl: './crear-alumno.component.html',
  styleUrls: ['./crear-alumno.component.css'],
})
export class CrearAlumnoComponent implements OnInit {
  paginas = 0;

  nacimiento = 'valor';
  sexo = 'valor';

  alumno: Alumno = new Alumno();
  sangres: String[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  lentesA: String[] = ['Si', 'No'];

  estados: Estado = new Estado();
  municipios: Municipio = new Municipio();
  postales: CodigoPostal = new CodigoPostal();
  colonias: Colonia = new Colonia();

  forma: FormGroup;
  accion: string;
  habilitaDomicilio: boolean = false;

  // creamos la instancia de form builder para usar reactivos
  constructor(
    private fb: FormBuilder,
    private as: AlumnoService,
    private es: ExternosService, 
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.alumno.domicilio = new Domicilio();
    this.alumno.tutores = [];

    this.crearFormulario();
    this.listener();
  }

  ngOnInit(): void {
    this.validarId();
  }

  /**
   * Paginador del formulario hacia delante
   */
  adelante() {
    this.paginas++;
  }

  /**
   * Paginador del formulario hacia atras
   */
  atras() {
    this.paginas--;
  }

  /**
   * Obtiene los municipios dado el cambio del estado
   */
  cambioEstado() {
    this.es
      .obtenerMunicipios(this.forma.value.domicilio.estadoLista)
      .subscribe((resp) => {
        //console.log(resp);
        this.municipios = resp;
        this.forma
          .get('domicilio')
          .get('municipioLista')
          .setValue(this.municipios.response.municipios[0]);
        this.cambioMunicipio();
      });
  }

  /**
   * Obtiene los codigos postales dado el cambio del municipio
   */
  cambioMunicipio() {
    this.es
      .obtenerCodigoPostal(this.forma.value.domicilio.municipioLista)
      .subscribe((resp) => {
        this.postales = resp;
        this.forma
          .get('domicilio')
          .get('postalLista')
          .setValue(this.postales.response.cp[0]);
        this.cambioPostal();
      });
  }

  /**
   * Obtiene las colonias dado el cambio del codigo postal
   */
  cambioPostal() {
    this.es
      .obtenerColonias(this.forma.value.domicilio.postalLista)
      .subscribe((resp) => {
        this.colonias = resp;
        this.forma
          .get('domicilio')
          .get('coloniaLista')
          .setValue(this.colonias.response.colonia[0]);
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
  // llenar los campos del formulario

  /**
   * Carga los datos del reactive form si se va editar
   */
  cargarDatosConValores() {
    if (this.alumno.domicilio) {
      this.forma
        .get('domicilio')
        .get('estadoLista')
        .setValue(this.alumno.domicilio.estado);
      this.cambioEstado();

      this.forma.reset({
        nombre: this.alumno.nombre,
        apePaterno: this.alumno.apePaterno,
        apeMaterno: this.alumno.apeMaterno,
        curp: this.alumno.curp,
        peso: this.alumno.peso,
        estatura: this.alumno.estatura,
        sangreLista: this.alumno.tipoSangre,
        lentesLista: this.alumno.usaLentes ? 'Si' : 'No',
        domicilio: {
          estadoLista: this.alumno.domicilio.estado,
          municipioLista: this.alumno.domicilio.municipio,
          postalLista: this.alumno.domicilio.codigoPostal,
          coloniaLista: this.alumno.domicilio.colonia,
          exterior: this.alumno.domicilio.exterior,
          interior: this.alumno.domicilio.interior,
          entreCalles: this.alumno.domicilio.entreCalles,
          referencia: this.alumno.domicilio.referencia,
        },
        tutor: this.alumno.tutores,
      });
    } else {
      this.forma.reset({
        nombre: this.alumno.nombre,
        apePaterno: this.alumno.apePaterno,
        apeMaterno: this.alumno.apeMaterno,
        curp: this.alumno.curp,
        peso: this.alumno.peso,
        estatura: this.alumno.estatura,
        sangreLista: this.alumno.tipoSangre,
        lentesLista: this.alumno.usaLentes ? 'Si' : 'No',
        domicilio: {
          exterior: this.alumno.domicilio?.exterior,
          interior: this.alumno.domicilio?.interior,
          entreCalles: this.alumno.domicilio?.entreCalles,
          referencia: this.alumno.domicilio?.referencia,
        },
        tutor: this.alumno.tutores,
      });

      this.forma
        .get('domicilio')
        .get('estadoLista')
        .setValue(this.estados.response.estado[0]);
      this.cambioEstado();
    }
  }

  /**
   * Carga los datos del reactive form si se va a crear
   */
  cargarDatosSinValores() {
    this.forma.get('sangreLista').setValue(this.sangres[0]);
    this.forma.get('lentesLista').setValue(this.lentesA[1]);
    this.forma
      .get('domicilio')
      .get('estadoLista')
      .setValue(this.estados.response.estado[0]);

    this.cambioEstado();
  }

  /**
   * Crea y establece la entidad para mandar
   */
  crear() {
    if (this.forma.valid) {
      //console.log(this.forma.value.nombre );

      this.alumno.nombre = this.forma.value.nombre;
      this.alumno.apePaterno = this.forma.value.apePaterno;
      this.alumno.apeMaterno = this.forma.value.apeMaterno;

      this.alumno.curp = this.forma.value.curp;
      this.alumno.fechaNacimiento = new Date(this.nacimiento);
      this.alumno.sexo = this.sexo;

      this.alumno.peso = this.forma.value.peso;
      this.alumno.estatura = this.forma.value.estatura;
      this.alumno.tipoSangre = this.forma.value.sangreLista;
      this.alumno.usaLentes =
        this.forma.value.lentesLista == 'Si' ? true : false;

      ////////////

      this.alumno.domicilio = new Domicilio();
      this.alumno.historiales = null;

      if (this.habilitaDomicilio) {
        this.alumno.domicilio = null;
      } else {
        this.alumno.domicilio.id = null;
        this.alumno.domicilio.estado = this.forma.value.domicilio.estadoLista;
        this.alumno.domicilio.municipio = this.forma.value.domicilio.municipioLista;
        this.alumno.domicilio.codigoPostal = this.forma.value.domicilio.postalLista;
        this.alumno.domicilio.colonia = this.forma.value.domicilio.coloniaLista;
        this.alumno.domicilio.exterior = this.forma.value.domicilio.exterior;
        this.alumno.domicilio.interior = this.forma.value.domicilio.interior;
        this.alumno.domicilio.entreCalles = this.forma.value.domicilio.entreCalles;
        this.alumno.domicilio.referencia = this.forma.value.domicilio.referencia;
      }

      //console.log(this.alumno);

      Swal.showLoading();

      let peticion: Observable<any>;

      if (!this.alumno.id) {
        peticion = this.as.crear(this.alumno);
      } else {
        peticion = this.as.editar(this.alumno, this.alumno.id);
      }

      peticion.subscribe(
        (resp) => {
          Swal.fire('Exito', `Alumno ${this.accion} con exito`, 'success');
          console.log( ":3" );
          this.router.navigate(['../../'], {relativeTo: this.route});
        },
        (err) => {
          switch (err.status) {
            case 400:
              Swal.fire(
                'Error',
                `Debe existir al menos 1 tutor a cargo o existen campos duplicados`,
                'error'
              );
              break;

            default:
              console.log(err);
          }
        }
      );
    } else {
      this.errorCampos();
    }
  }

  // establecemos la validaciones con fb a la forma o formulacion
  // campo: [ valor defecto,]
  crearFormulario() {
    this.forma = this.fb.group({
      nombre: ['', Validators.required],
      apePaterno: ['', Validators.required],
      apeMaterno: ['', Validators.required],
      curp: ['', [Validators.required, Validators.pattern( '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$') ]],
      peso: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      estatura: [
        '',
        [Validators.required, Validators.pattern('^[0-2][.][0-9]{2}$')],
      ],
      sangreLista: ['', Validators.required],
      lentesLista: ['', Validators.required],

      domicilio: this.fb.group({
        estadoLista: [''],
        municipioLista: [''],
        postalLista: [''],
        coloniaLista: [''],
        exterior: ['', [Validators.required]],
        interior: ['', [Validators.required]],
        entreCalles: [''],
        referencia: [{ value: '', disabled: false }],
      }),
    });
  }

  // para llenar los campos deshabilitados
  listener() {
    this.forma.get('curp').valueChanges.subscribe((valor) => {
      if (!this.campoInvalido('curp')) {
        //console.log('valido');
        //asignamos el sexo dada la curp
        this.sexo = valor[10] === 'H' ? 'Hombre' : 'Mujer';
        //asignamos la fecha de nacimiento data la curp
        this.nacimiento = this.obtenerFecha(valor);
      }
    });
  }

  //evento para omitir campos de domicilio
  omiteDomicilio(event: any) {
    // obtenemos la parte del formulario que tiene el domicilio
    const formulario = this.forma.get('domicilio');

    this.habilitaDomicilio = event.currentTarget.checked; // obtenemos el chekcbox
    //console.log( this.habilitaDomicilio );

    if (this.habilitaDomicilio) {
      formulario.get('estadoLista').disable();
      formulario.get('municipioLista').disable();
      formulario.get('postalLista').disable();
      formulario.get('coloniaLista').disable();
      formulario.get('exterior').disable();
      formulario.get('interior').disable();
      formulario.get('entreCalles').disable();
      formulario.get('referencia').disable();
    } else {
      formulario.get('estadoLista').enable();
      formulario.get('municipioLista').enable();
      formulario.get('postalLista').enable();
      formulario.get('coloniaLista').enable();
      formulario.get('exterior').enable();
      formulario.get('interior').enable();
      formulario.get('entreCalles').enable();
      formulario.get('referencia').enable();
    }
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

  //metodo que retorna una lista ordenada
  sort(model: any) {
    return model.sort((a, b) => (a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1));
  }

  /**
   * Validar si viene o no el di para saber si se va editar o no
   */
  validarId() {
    this.es.obtenerEstados().subscribe((resp) => {
      this.estados = resp;

      const id = this.route.snapshot.paramMap.get('id');
      //console.log(id);
      if (id) {
        this.as.buscarPorId(id).subscribe(
          (resp: Alumno) => {
            //console.log( resp );
            this.alumno = resp;
            this.alumno.id = +id;
            this.accion = 'editado';
            
            this.cargarDatosConValores();
          },
          (err) => {
            if (err.status === 404) {
              Swal.fire('Error', `El alumno con id ${id} no existe`, 'error');
              this.router.navigate(['/alumnos']);
            }
          }
        );
      } else {
        this.cargarDatosSinValores();
        this.accion = 'creado';
      }
    });
  }

  agregarTutor(indiceTutor?: number) {
    //console.log("recibo " + indiceTutor );
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-class',
    };

    //console.log( this.alumno.tutores );

    let tutorTemporal: Tutor =
      indiceTutor === undefined
        ? new Tutor()
        : this.alumno.tutores[indiceTutor];

    //console.log(tutorTemporal);

    const modalRef = this.modalService.open(TutorComponent, ngbModalOptions);
    modalRef.componentInstance.tutor = tutorTemporal;

    modalRef.result
      .then((resp) => {
        if (resp) {
          //console.log(resp);
          if (indiceTutor === undefined) {
            this.alumno.tutores.push(resp);
          } else {
            this.alumno.tutores[indiceTutor] = resp;
          }
        }
      })
      .catch((err) => {});
  }

  eliminarTutor(indiceTutor: number) {
    this.alumno.tutores = this.alumno.tutores.filter( (ele) => ele.id != this.alumno.tutores[indiceTutor].id );
  }

  errorCampos() {
    Swal.fire('Error', 'Existen campos incorrectos', 'error');
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
