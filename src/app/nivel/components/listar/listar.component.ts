import { Component, OnInit } from '@angular/core';
import { NivelService } from '../../services/nivel.service';
import { Nivel } from '../../entity/nivel';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Carrera } from '../../entity/carrera';
import { InfoNivelComponent } from '../modals/info-nivel/info-nivel.component';
import { InfoCarreraComponent } from '../modals/info-carrera/info-carrera.component';
import { CicloEscolar } from '../../entity/cicloEscolar';
import { InfoCicloEscolarComponent } from '../modals/info-ciclo-escolar/info-ciclo-escolar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  niveles: Nivel[] = [];
  indiceNivel: number = -1;
  indiceCarrera: number = -1;

  constructor(private ns: NivelService, private modalService: NgbModal, private router: Router) {}

  ngOnInit(): void {
    this.ns.listar().subscribe((resp) => {
      console.log(resp);
      this.niveles = resp;
    });
  }

  verCarreras(indiceNivel: number) {

    this.indiceNivel = indiceNivel;
    this.indiceCarrera = -1;

  }

  verCiclos( indiceCarrera: number ){

    this.indiceCarrera = indiceCarrera;
    //console.log( this.niveles[this.indiceNivel].carreras[this.indiceCarrera] );
    //console.log(indiceCarrera);

  }


  editarNivel(nivelindiceNivel?: number) {


    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-class',
    };

    //console.log( this.alumno.tutores );

    let nivelTemporal: Nivel =
      nivelindiceNivel === undefined ? new Nivel() : this.niveles[nivelindiceNivel];


    //console.log(nivelTemporal);

    const modalRef = this.modalService.open(
      InfoNivelComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.nivel = nivelTemporal;

    modalRef.result
      .then((resp) => {
        if (resp) {
          //console.log(resp);

          switch (resp) {
            case 'eliminar':
              this.niveles = this.niveles.filter(
                (ele) => ele.id != nivelTemporal.id                      
              );
              this.indiceNivel = -1

              break;
            case 'crear':
              this.niveles.push( nivelTemporal );
              break;
            default:
              break;
          }
        }
      })
      .catch((err) => {});
  }

  editarCarrera(  indiceNivel: number ,carrera? : Carrera ) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-class',
    };

    let carreraTemporal: Carrera =
      carrera === undefined ? new Carrera() :  carrera;

    //console.log( indiceNivel , carreraTemporal );


    const modalRef = this.modalService.open(
      InfoCarreraComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.carrera = carreraTemporal;
    modalRef.componentInstance.idNivel = indiceNivel;  


    modalRef.result
    .then((resp) => {
      if (resp) {
        //console.log(resp);
        switch (resp) {
          case 'eliminar':

            this.niveles.forEach( nivel =>{
              if( nivel.id == indiceNivel ){ 


                nivel.carreras = nivel.carreras.filter(
                  (ele) => ele.id != carreraTemporal.id                      
                );

              }
            });
            
           
            break;
          case 'crear':

            this.niveles.forEach( nivel =>{
              if( nivel.id == indiceNivel ){                

                nivel.carreras.push( carreraTemporal );
              }
            });
            
            break;
          default:
            break;
        }
      }
    })
    .catch((err) => {});

    
  }

  editarCiclo(  indiceCarrera: number ,cicloEscolar? : CicloEscolar ) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'my-class',
    };

    let cicloEscolarTemporal: CicloEscolar =
      cicloEscolar === undefined ? new CicloEscolar() :  cicloEscolar;

    //console.log( indiceCarrera , cicloEscolarTemporal );


    const modalRef = this.modalService.open(
      InfoCicloEscolarComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.cicloEscolar = cicloEscolarTemporal;
    modalRef.componentInstance.idCarrera = indiceCarrera;  


    modalRef.result
    .then((resp) => {
      if (resp) {
        //console.log(resp);
        switch (resp) {
          case 'eliminar':

            this.niveles[this.indiceNivel].carreras.forEach( carrera =>{
              if( carrera.id == indiceCarrera ){ 

                carrera.ciclosEscolares = carrera.ciclosEscolares.filter(
                  (ele) => ele.id != cicloEscolarTemporal.id                      
                );

              }
            });
            
           
            break;
          case 'crear':

            this.niveles[this.indiceNivel].carreras.forEach( carrera =>{
              if( carrera.id == indiceCarrera ){                

                carrera.ciclosEscolares.push( cicloEscolarTemporal );
              }
            });
            
            break;
          default:
            break;
        }
      }
    })
    .catch((err) => {});

    
  }

  


}
