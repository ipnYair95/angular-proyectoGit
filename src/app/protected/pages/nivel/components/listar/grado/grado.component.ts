import { Component, OnInit } from '@angular/core';
import { CicloEscolarService } from '../../../services/ciclo-escolar.service';
import { ActivatedRoute } from '@angular/router';
import { CicloEscolar } from '../../../entity/cicloEscolar';
import { GradoService } from '../../../services/grado.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Grado } from '../../../entity/grado';
import Swal from 'sweetalert2';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { InfoAsignaturaComponent } from '../../modals/info-asignatura/info-asignatura.component';
import { Asignatura } from '../../../entity/asignatura';

@Component({
  selector: 'app-grado',
  templateUrl: './grado.component.html',
  styleUrls: ['./grado.component.css'],
})
export class GradoComponent implements OnInit {

  idCicloEscolar: number;
  carrera: string;
  nivel: string;

  cicloEscolar: CicloEscolar = new CicloEscolar();

  forma: FormGroup;

  gradoCancel : Grado = new Grado();

  constructor(
    private cicloService: CicloEscolarService,
    private gradoService: GradoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.idCicloEscolar = +this.route.snapshot.paramMap.get('idCicloEscolar');
    this.carrera = this.route.snapshot.paramMap.get('nombreCarrera');
    this.nivel = this.route.snapshot.paramMap.get('nivel');

    this.cicloService.buscarPorId(this.idCicloEscolar).subscribe((resp) => {
      //console.log(resp);
      this.cicloEscolar = resp;
      this.crearFormulario();
    });
  }

  ngOnInit(): void {
  
  }

  crearFormulario() {

    // creamos un form array que tendra la lista de grados
    this.forma = this.fb.group({
      nombreGradoAgregar: [ '', [ Validators.required,Validators.pattern("^[1-9][0-9]*[°] [A-Z][a-z]+$") ] ],
      gradosLista: this.fb.array([])
    });

    // poblamos el array del fb.array
    this.getGrados();
  
  }


  // usamos un get para obtener gradosLista de la forma, como un form array
  get getListaAsArray() : FormArray {
     return this.forma.get('gradosLista') as FormArray; 
  }

 
  getGrados(){
    
    // usando el metodo get gradosLista(), añadimos controles  por cada grado
    //this.cicloEscolar.grados.forEach

    this.sort( this.cicloEscolar.grados ).forEach( grado =>{
      this.getListaAsArray.push( this.addGrado( grado )  );
    });
   //console.log( this.forma.value );

  }

  // a cada push le creamos su validacion y su valor por defecto
  addGrado( grado : Grado ): FormGroup {
    return this.fb.group({
      idGrado:  grado.id,
      nombreGrado: [ grado.nombreGrado , [ Validators.required,Validators.pattern("^[1-9][0-9]*[°] [A-Z][a-z]+$") ] ],      
      nombreGradoBackup: [''],
      disable: []
    })
  }

  /**
   * 
   * @param i control o subgrupo de inputs
   * @param campo campo del subgrupo de inputs 
   */
  getValiditySubForm( i, campo: string) {
    return this.getListaAsArray.controls[i].get(`${campo}`).invalid && this.getListaAsArray.controls[i].get(`${campo}`).touched;
  }

  getValidity( campo: string) {
    return this.forma.get(`${campo}`).invalid && this.forma.get(`${campo}`).touched
  }
 
 
  editarGradoActivated(indiceGrado: number) {

    let backp = this.getListaAsArray.controls[indiceGrado].get(`nombreGrado`).value;

    this.getListaAsArray.controls[indiceGrado].get(`nombreGradoBackup`).setValue( backp );
    this.getListaAsArray.controls[indiceGrado].get(`disable`).setValue( true );

    console.log( "backup" + this.getListaAsArray.controls[indiceGrado].get(`nombreGradoBackup`).value );
  
  
  }

  cancelar(indiceGrado: number) {

    let backp = this.getListaAsArray.controls[indiceGrado].get(`nombreGradoBackup`).value;
    this.getListaAsArray.controls[indiceGrado].get(`nombreGrado`).setValue(  backp );    
    this.getListaAsArray.controls[indiceGrado].get(`disable`).setValue( false );
  
  }

  crear( indiceGrado?: number ) {

    if( indiceGrado == undefined ){

      if ( this.forma.get('nombreGradoAgregar').valid  ) {
        let gradoTemporal: Grado = new Grado();
        gradoTemporal.nombreGrado = this.forma.value.nombreGradoAgregar;
        const jerarquia = gradoTemporal.nombreGrado.split( '°', 1 );
        gradoTemporal.jerarquia = +jerarquia;        
        console.log( "Jerarquia", gradoTemporal.jerarquia );
        this.gradoService.agregar(this.idCicloEscolar, gradoTemporal).subscribe(
          (resp) => { 
  
            gradoTemporal = resp;            
            this.resetArrayAdd( gradoTemporal );
            Swal.fire( 'Exito', `${ gradoTemporal.nombreGrado } creado con exito`, 'success' );            
  
          },
          (err) => {
            //console.log(err);
            Swal.fire( 'Error', `Ha ocurrido un error`, 'error'  );
          }
        );
      } else {
        console.log("errr");
        Swal.fire( 'Exito', `Existen campos no validos`, 'error' );
        this.errorCampos();
      }
  

    }else{

      if ( this.getListaAsArray.controls[ indiceGrado ].get('nombreGrado').valid  ) {
        
        let gradoTemporal: Grado = new Grado();

        gradoTemporal.id = this.getListaAsArray.controls[ indiceGrado ].get('idGrado').value;        
        gradoTemporal.nombreGrado = this.getListaAsArray.controls[ indiceGrado ].get('nombreGrado').value;

        const jerarquia = gradoTemporal.nombreGrado.split( '°', 1 );
        gradoTemporal.jerarquia = +jerarquia;  

        this.gradoService.editar( this.idCicloEscolar,  gradoTemporal.id , gradoTemporal ).subscribe(
          (resp) => {               
            Swal.fire( 'Exito', `${ gradoTemporal.nombreGrado } editado con exito`, 'success' );  
            //this.getListaAsArray.controls[indiceGrado].get(`disable`).setValue( false );
            this.resetArrayEdit( gradoTemporal );

          },
          (err) => {
            console.log(err);
            Swal.fire( 'Error', `Ha ocurrido un error`, 'error'  );
          }
        );
      } else {
        console.log("errr");
        Swal.fire( 'Exito', `Existen campos no validos`, 'error' );
        this.errorCampos();
      }

    }
  
   

  }

  eliminar( indiceGrado : number ){

    let gradoTemporal: Grado = new Grado();

    gradoTemporal.id = this.getListaAsArray.controls[ indiceGrado ].get('idGrado').value;
    gradoTemporal.nombreGrado = this.getListaAsArray.controls[ indiceGrado ].get('nombreGrado').value;

    Swal.fire({
      title: '¿Eliminar el grado?',
      text: ` Eliminar el grado ${ gradoTemporal.nombreGrado } `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    })
      .then((result) => {
        if (result.isConfirmed) {

          this.gradoService.eliminar( this.idCicloEscolar, gradoTemporal.id ).subscribe(
            (resp) => {               
              Swal.fire( 'Exito', `${ gradoTemporal.nombreGrado } eliminado con exito`, 'success' );  
              //this.getListaAsArray.controls[indiceGrado].get(`disable`).setValue( false );
              this.resetArrayDelete( gradoTemporal );
    
            },
            (err) => {
              console.log(err);
              Swal.fire( 'Error', `Ha ocurrido un error`, 'error'  );
            }
          );
         

        }
      })
      .catch((err) => {
        Swal.fire('Error', 'Ha ocurrido un error', 'error');
      });

      

  }

 
  errorCampos() {
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

  //metodo que retorna una lista ordenada
  sort(grado: Grado[]) {
    return grado.sort((a, b) =>
      +a.nombreGrado.split( '°' , 1 ) > +b.nombreGrado.split( '°', 1 )
        ? 1
        : +a.nombreGrado.split( '°' , 1 ) > +b.nombreGrado.split( '°', 1 )
        ? 0
        : -1
    );
  }

  resetArrayAdd( grado : Grado ){    
    this.getListaAsArray.clear();
    this.cicloEscolar.grados.push( grado );       
    this.getGrados();
  }

  resetArrayEdit( grado : Grado ){

    console.log( this.cicloEscolar.grados );

    for( let i = 0; i < this.cicloEscolar.grados.length; i++ ){
        if( this.cicloEscolar.grados[i].id == grado.id ){
            this.cicloEscolar.grados[i].id = grado.id;
            this.cicloEscolar.grados[i].nombreGrado = grado.nombreGrado;
        }
    }

    console.log( this.cicloEscolar.grados );

    this.getListaAsArray.clear();    
    this.getGrados();
  }

  resetArrayDelete( grado : Grado ){

    this.cicloEscolar.grados = this.cicloEscolar.grados.filter(  (ele) => ele.id != grado.id   );
    console.log( this.cicloEscolar.grados );
    this.getListaAsArray.clear();    
    this.getGrados();
  }


   
  editarAsignatura( indiceGrado: number ,indiceAsignatura?: number) {


    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-class',
    };

    //console.log( this.alumno.tutores );

    let asignaturaTemporal: Asignatura =
      indiceAsignatura === undefined ? new Asignatura() : this.cicloEscolar.grados[indiceGrado].asignaturas[indiceAsignatura];


    //console.log(nivelTemporal);

    const modalRef = this.modalService.open(
      InfoAsignaturaComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.asignatura = asignaturaTemporal;
    modalRef.componentInstance.idGrado = this.cicloEscolar.grados[indiceGrado].id;
    
 
    modalRef.result
      .then((resp) => {
        if (resp) {
          //console.log(resp);

          switch (resp) {
            case 'eliminar':
              this.cicloEscolar.grados[indiceGrado].asignaturas = this.cicloEscolar.grados[indiceGrado].asignaturas.filter(
                (ele) => ele.id != asignaturaTemporal.id                      
              ); 

              break;
            case 'crear':
              this.cicloEscolar.grados[indiceGrado].asignaturas.push( asignaturaTemporal );
              break;
            default:
              break;
          }
        }
      })
      .catch((err) => {});
  
  }



}

