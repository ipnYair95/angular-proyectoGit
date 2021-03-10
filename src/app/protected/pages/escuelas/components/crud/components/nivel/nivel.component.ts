import { Component, OnInit } from '@angular/core';
import { EscuelaService } from '../../../../services/escuela.service';
import { ActivatedRoute } from '@angular/router';
import { Cct } from '../../../models/cct';
import { Nivel } from '../../../../../nivel/entity/nivel';
import { NivelService } from '../../../../../nivel/services/nivel.service';
import { RelacionEducativoService } from '../../../../services/relacion-educativo.service'; 
import { NivelEscuela, ModalidadNivel } from '../../../models/relaciones';
import { forkJoin, Observable } from 'rxjs';
import { CarreraService } from '../../../../../nivel/services/carrera.service';
import { Carrera } from '../../../../../nivel/entity/carrera';
import { Notificaciones, Opcion } from 'src/app/ayudas/notificaciones';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.component.html',
  styleUrls: ['./nivel.component.css']
})
export class NivelComponent implements OnInit {

  //// NIVELES ESCUELAS
  columnasNiveles: string[] = ['index', 'nivel', 'eliminar', 'ver'];
  nivelesDeEscuela: Nivel[] = [];
  dataSourceNiveles

  
  //// NIVELES MODALIDAD
  seleccionNivelEscuela : NivelEscuela;

  columnasModalidades: string[] = ['index', 'modalidad', 'eliminar', 'ver'];
  modalidadNivel: Carrera[] = [];
  dataSourceModalidad;

  /////// DATOS PARA EL API NIVELES
  columnasApi: string[] = ['index', 'nombre', 'agregar'];
  
  modalidadesDb: Carrera[] = [];
  nivelesDb: Nivel[] = [];
  dataSource;

  ///////

  showCard: boolean = false;
  tieneContenido = false;
  
  title =  "";
  subTitle = "";
  titleAdd = "";

  escuela: Cct = new Cct();
  tabIndex = 0;

  constructor(
    private nivelService: NivelService,
    private modalidadService: CarreraService,
    private escuelaService: EscuelaService,
    private relacionService: RelacionEducativoService,
    private route: ActivatedRoute
  ) {

    const id = this.route.snapshot.params.id;
    this.escuelaService.buscarPodId(id).subscribe(resp => {
      this.escuela = resp;
      this.title = "NIVELES DE " +  this.escuela.cct.toUpperCase() + this.escuela.nombre.toUpperCase();
      this.subTitle = "NIVELES DISPONIBLES";
      this.titleAdd = "AGREGAR NIVEL";
      this.obtenerInfoNiveles();
    });

  }

  ngOnInit(): void {

  }


  ////////// niveles

  agregarNivel(idNivel: number) {

    let nuevaRelacion = new NivelEscuela();
    nuevaRelacion.idNivel = idNivel

    this.relacionService.asignarNivel(this.escuela.id, nuevaRelacion).subscribe(resp => {
      console.log(resp);
      Notificaciones.enviarNotificacion(Opcion.exitoCustomReload, "Nivel añadido");
    }, err => Notificaciones.enviarNotificacion(Opcion.errorCustom, "Ya existe el nivel"));


  }

  buscarInfoApi() {

    switch (this.tabIndex) {

      case 0:
        this.showCard = !this.showCard;

        this.nivelService.listar().subscribe(resp => {
          this.nivelesDb = resp;
          this.dataSource = this.nivelesDb;
          this.tieneContenido = this.nivelesDb.length > 0 ? true : false;
        });

        break;

      case 1:

        this.showCard = !this.showCard;

        this.nivelService.buscarPorId( this.seleccionNivelEscuela.idNivel ).subscribe( resp =>{
          console.log(resp.carreras);
          this.modalidadesDb = resp.carreras;
          this.dataSource = this.modalidadesDb;
          this.tieneContenido = this.modalidadesDb.length > 0 ? true : false;
        });

        break;
    }



  }

  obtenerInfoNiveles() {

    let observableData = [];

    if (this.escuela.nivelEscuela.length > 0) {

      this.escuela.nivelEscuela.forEach(nivel => {
        observableData.push( this.nivelService.buscarPorId(nivel.idNivel) );
      });

      forkJoin(observableData).subscribe(resp => {
        resp.forEach((nivel: Nivel) => {
          this.nivelesDeEscuela.push( nivel );
        })
        this.dataSourceNiveles = this.nivelesDeEscuela;
      });

    }
  }

  eliminarNivel(idNivel: number) {

    let idRelacion;

    this.escuela.nivelEscuela.forEach(relacion => {
      if (relacion.idNivel === idNivel) {
        idRelacion = relacion.id;
      }
    });

    this.relacionService.eliminarNivel(this.escuela.id, idRelacion).subscribe(resp => {
      Notificaciones.enviarNotificacion(Opcion.exitoCustomReload, "Nivel eliminado con exito");
    }, err => { Notificaciones.enviarNotificacion(Opcion.error) });

  }

  ////////// modalidades

  agregarModalidad(idModalidad: number) {

    let nuevaRelacion = new ModalidadNivel();
    nuevaRelacion.idModalidad = idModalidad

    this.relacionService.asignarModalidad(  this.seleccionNivelEscuela.id, nuevaRelacion).subscribe(resp => {
      console.log(resp);
      Notificaciones.enviarNotificacion(Opcion.exitoCustomReload, "Modalidad añadida");
    }, err => Notificaciones.enviarNotificacion(Opcion.errorCustom, "Ya existe la modalidad"));


  }

  eliminarModalidad(idModalidad: number) {

    console.log( this.seleccionNivelEscuela.modalidades );
    let idRelacion = this.seleccionNivelEscuela.modalidades.find( modalidad => modalidad.idModalidad == idModalidad ).id;
        

    this.relacionService.eliminarModalidad( this.seleccionNivelEscuela.id, idRelacion).subscribe(resp => {
      Notificaciones.enviarNotificacion(Opcion.exitoCustomReload, "Nivel eliminado con exito");
    }, err => { Notificaciones.enviarNotificacion(Opcion.error) });

  }

  obtenerInfoModalidades( idNivel: number) {

   
    this.escuela.nivelEscuela.forEach(relacion => {
      if (relacion.idNivel === idNivel) {
        this.seleccionNivelEscuela = relacion;
      }
    });

    console.log( this.seleccionNivelEscuela );
    
    this.cambioTabDelante();   


    let observableData = [];

    if (  this.seleccionNivelEscuela.modalidades.length > 0) {
      this.seleccionNivelEscuela.modalidades.forEach(modalidad => {
        observableData.push(this.modalidadService.buscarPorId(modalidad.idModalidad));
      });

      forkJoin(observableData).subscribe(resp => {
        resp.forEach((modalidad: Carrera) => {
          this.modalidadNivel.push(modalidad);
          console.log(modalidad);
        })
        this.dataSourceModalidad = this.modalidadNivel;
      });

    } else {
      console.log("no tiene");
    }

  }
  

  cambioTabDelante() {
    this.tabIndex++;
    this.showCard = false;
    this.tieneContenido = false;

    switch (this.tabIndex) {
      case 1:
        console.log(this.nivelesDeEscuela);
        this.title = "MODALIDADES DE " + this.nivelesDeEscuela.find( nivel => this.seleccionNivelEscuela.idNivel == nivel.id ).nombreNivel;
        this.subTitle = "MODALIDADES DISPONIBLES";
        this.titleAdd = "AGREGAR MODALIDAD";
        break;
      }
      
      
    }
    
    cambioTabAtras() {
      this.tabIndex--;
      this.showCard = false;
      this.tieneContenido = false;
      
      switch (this.tabIndex) {
        case 0:
          
        this.title = "NIVELES DE " +  this.escuela.cct.toUpperCase() + this.escuela.nombre.toUpperCase();
        this.subTitle = "NIVELES DISPONIBLES";
        this.titleAdd = "AGREGAR NIVEL";
        break;
    }

  }





}
