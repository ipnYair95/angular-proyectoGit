import { Component, OnInit } from '@angular/core';
import { Cct } from '../../models/cct';
import { EscuelaService } from '../../../services/escuela.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternosService } from '../../../../services/externos.service';
import { Estado } from '../../../../models-externos/estado';
import { Municipio } from '../../../../models-externos/municipio';
import { CodigoPostal } from '../../../../models-externos/codigo-postal';
import { Colonia } from '../../../../models-externos/colonia';
import Swal from 'sweetalert2';
import { Salon } from '../../models/salon';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-escuela',
  templateUrl: './datos-escuela.component.html',
  styleUrls: ['./datos-escuela.component.css']
})
export class DatosEscuelaComponent implements OnInit {

  /* Modelos extenos */
  estados: Estado = new Estado();
  municipios: Municipio = new Municipio();
  codigosPostales: CodigoPostal = new CodigoPostal();
  colonias: Colonia = new Colonia();
  /**/

  /* Tabla  */
  displayedColumns: string[] = [];
  dataSource;
  /**/

  escuela: Cct;
  forma: FormGroup;

  constructor( 
    public cctService : EscuelaService,
    private fb: FormBuilder, 
    private router: Router,
    private externoService : ExternosService 
    ) {
    
      if (this.cctService.validaUsuario()) {

        const id = (JSON.parse(sessionStorage.getItem('usuario')) as Cct).id;
        this.cctService.buscarPodId(id).subscribe(resp => {
  
          this.escuela = resp;
          console.log(this.escuela);
  
        })
  
      } else {
        this.router.navigateByUrl("../index");
      }

      this.llenarSelect();
    
   }

  ngOnInit(): void {

    

  }

  crearFormulario(){

    console.log(this.escuela);

    const {
      id,
      cct,
      nombre,
      turno,
      email,
      telefono,
      extension,
      sostenimiento,
      dependenciaNormativa,
      domicilio
    } = this.escuela;

    const {
      estado,
      exterior,
      interior,
      entreCalles,
      referencia
    } = domicilio;
    

    this.forma = this.fb.group({
      id:                     [ id ],
      cct:                    [ cct, [ Validators.required, Validators.pattern("^(([0-2][0-9])|([3][0-2]))[A-Z]{3}[0-9]{4}[A-Z]$") ] ],
      nombre:                 [ nombre, [ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$') ] ],
      turno:                  [ turno, [ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$') ] ],
      email:                  [ email, [ Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')] ],
      telefono:               [ telefono, [ Validators.required, Validators.pattern('^([0-9]|-)*$')] ],
      extension:              [ extension, [ Validators.pattern('^([0-9]|-)*$')] ],
      sostenimiento:          [ sostenimiento, [ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$')] ],
      dependenciaNormativa:   [ dependenciaNormativa, [ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$')] ],
      domicilio: this.fb.group ({
        estado:               [ this.estados.response.estado.includes( estado ) ? estado : this.estados.response.estado[0] ],
        municipio:            [''],
        codigoPostal:         [''],
        colonia:              [''],
        exterior:             [exterior, [ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$')] ],
        interior:             [interior],
        entreCalles:          [entreCalles,[ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$')] ],
        referencia:           [referencia, [ Validators.required, Validators.pattern('^([^a-z\\s]+ ?)+$')] ]      
      }),
      salones: this.fb.array([])
      
    });

    this.setReactiveSalones();
    this.cambioEstado();
    

  }

  /* REACTIVE FORM DE SALONES */

 get listaAsArray() : FormArray {
    return this.forma.get('salones') as FormArray; 
 }
 

  setReactiveSalones(){  

    this.escuela.salones.forEach( salon =>{
      this.listaAsArray.push( this.addSalonControl( salon )  );    
    });      

    this.dataSource = new MatTableDataSource( this.listaAsArray.controls ); // solo para mat-table o angular material

  }

  addSalonControl( salon : Salon ): FormGroup {
    return this.fb.group({
      id: salon.id,
      nombre:      [ salon.nombre , [ Validators.required,Validators.pattern("^([^a-z\\s]+ ?)+$") ] ],      
      capacidad:   [ salon.capacidad , [ Validators.required,Validators.pattern("^([0-9]|-)*$") ] ],      
      estatus:     [ salon.estatus , [ Validators.required,Validators.pattern("^([^a-z\\s]+ ?)+$") ] ],      
    })
  
  }

  getValiditySubForm( i, campo: string) {
    return this.listaAsArray.controls[i].get(`${campo}`).invalid && this.listaAsArray.controls[i].get(`${campo}`).touched;
  }

  addSalon(){
    this.listaAsArray.push( this.addSalonControl( new Salon() ) );
    this.dataSource = new MatTableDataSource( this.listaAsArray.controls ); // solo para mat-table o angular material
  }

  removeSalon( i : number ){     
    this.listaAsArray.removeAt( i );
    this.dataSource = new MatTableDataSource( this.listaAsArray.controls ); // solo para mat-table o angular material
  }

  /****/

  getValidity( campo: string) {
    return this.forma.get(`${campo}`).invalid && this.forma.get(`${campo}`).touched
  }

  cambioEstado() {

    Swal.showLoading();

    const estado = this.forma.get('domicilio').get('estado').value;    
    const municipioDb = this.escuela.domicilio.municipio;    

    this.externoService.obtenerMunicipios(estado).subscribe(resp => {      
      this.municipios = resp;
      this.municipios.response.municipios = this.municipios.response.municipios.map( this.cambioMayusculas );
      this.forma
        .get('domicilio')
        .get('municipio')
        .setValue( this.municipios.response.municipios.includes( municipioDb ) ? municipioDb : this.municipios.response.municipios[0] );
        Swal.close();
        this.cambioMunicipio();
    },(err)=>{
      Swal.fire('Error','El servicio SEPOMEX no se encuentra en este momento','error');
    });
  }

  cambioMunicipio(){

    Swal.showLoading();
    const municipio = this.forma.get('domicilio').get('municipio').value;    
    const codigoPostalDb = this.escuela.domicilio.codigoPostal;
    this.externoService.obtenerCodigoPostal(municipio).subscribe(resp => {      
      this.codigosPostales = resp;
      this.forma
        .get('domicilio')
        .get('codigoPostal')
        .setValue( this.codigosPostales.response.cp.includes( codigoPostalDb ) ? codigoPostalDb : this.codigosPostales.response.cp[0] );
        Swal.close();
        this.cambioCodigoPostal();
    },(err)=>{
      Swal.fire('Error','El servicio SEPOMEX no se encuentra en este momento','error');
    });
  }

  cambioCodigoPostal(){

    Swal.showLoading();

    const codigoPostal = this.forma.get('domicilio').get('codigoPostal').value;    
    const coloniaDb = this.escuela.domicilio.colonia;
    

    this.externoService.obtenerColonias(codigoPostal).subscribe(resp => {      
      this.colonias = resp;
      this.colonias.response.colonia = this.colonias.response.colonia.map( this.cambioMayusculas );
      this.forma
        .get('domicilio')
        .get('colonia')
        .setValue( this.colonias.response.colonia.includes( coloniaDb ) ? coloniaDb : this.colonias.response.colonia[0] );        
        Swal.close();
    },(err)=>{
      Swal.fire('Error','El servicio SEPOMEX no se encuentra en este momento','error');
    });
  } 

  guardar(){
    if( this.forma.valid ){

      console.log(this.escuela);
      this.escuela = this.forma.value;      
      console.log(this.escuela);

      
      this.cctService.editar( this.escuela ).subscribe( resp =>{              
        Swal.fire('Exito','Datos actualizados','success').then(  action  => 
          this.cctService.buscarPodId( this.escuela.id ).subscribe( resp =>{
            this.escuela = resp;
            window.location.reload()  
          }) 
        );        
      }, (err) =>{
        Swal.fire('Error','Ha ocurrido un error','error');
      });
      
      
    }else{
      Swal.fire('Error','Existen campos no validos','error');
    }
  }

  llenarSelect() {

    Swal.showLoading();

    this.externoService.obtenerEstados().subscribe(resp => {    
    
    this.estados = resp;
    this.estados.response.estado = this.estados.response.estado.map( this.cambioMayusculas );    
    this.crearFormulario();     
    Swal.close();

    },(err)=>{
      Swal.fire('Error','El servicio SEPOMEX no se encuentra en este momento','error');
      this.crearFormulario();     
    });

  }

  sort(model: any) {
    return model.sort((a, b) => (a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1));
  }

  cambioMayusculas( texto : String ){
    return texto.toUpperCase();
  }

  

}

