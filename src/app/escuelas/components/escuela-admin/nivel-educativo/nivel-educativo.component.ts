import { Component, OnInit } from '@angular/core';
import { EscuelaService } from '../../../services/escuela.service';
import { NivelService } from '../../../../nivel/services/nivel.service';
import { Cct } from '../../models/cct';
import { Nivel } from '../../../../nivel/entity/nivel';

@Component({
  selector: 'app-nivel-educativo',
  templateUrl: './nivel-educativo.component.html',
  styleUrls: ['./nivel-educativo.component.css']
})
export class NivelEducativoComponent implements OnInit {

  idNiveles: number[] = [];
  niveles: Nivel[] = [];

  constructor( private escuelaService: EscuelaService, private nivelService :NivelService ) { 

    /*
    const id = this.escuelaService.idEscuelaSesion;

    this.escuelaService.buscarPodId( id ).subscribe( resp =>{
      
      this.idNiveles = resp.nivelEscuela.map( nivel =>{ return nivel.idNivel });
      this.getListaNiveles();     

    });*/

  }

  ngOnInit(): void {

  }

  getListaNiveles(){
  
    this.idNiveles.forEach( id => {
      this.nivelService.buscarPorId( id ).subscribe( resp =>{        
        this.niveles.push( resp );
      });

    });

  }

  cambioEstado(){

  }

  sort(model: any) {
    return model.sort((a, b) => (a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1));
  }

}
