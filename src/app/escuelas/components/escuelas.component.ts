import { Component, OnInit } from '@angular/core';
import { EscuelaService } from '../services/escuela.service';


@Component({
  selector: 'app-escuelas',
  templateUrl: './escuelas.component.html',
  styleUrls: ['./escuelas.component.css']
})
export class EscuelasComponent implements OnInit {

  constructor( private escuelaService: EscuelaService ) {

    if( !sessionStorage.getItem('usuario')   ){
      this.escuelaService.buscarPodId(1).subscribe( resp =>{              
        sessionStorage.setItem( "usuario", JSON.stringify( resp ) );                
        console.log("Persistido, " , JSON.parse( sessionStorage.getItem('usuario')   ) );        
      });      
    }else{
      console.log("existe");
    }
    
   }

  ngOnInit(): void {
  }

}
