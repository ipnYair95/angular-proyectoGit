import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EscuelaAdminRoutingModule } from './escuela-admin-routing.module';
import { AltaAlumnosComponent } from './alta-alumnos/alta-alumnos.component';
import { CardCicloActualComponent } from './card-ciclo-actual/card-ciclo-actual.component';
import { GruposComponent } from './grupos/grupos.component';
import { IndexComponent } from './index/index.component';
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../ayudas/material/material.module';
import { CrearAlumnoEComponent } from './grupos/crear-alumno/crear-alumno-e.component';
import { TutorEComponent } from './grupos/crear-alumno/tutor/tutor.e.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DatosEscuelaComponent } from './datos-escuela/datos-escuela.component';
import { CambioGrupoComponent } from './grupos/cambio-grupo/cambio-grupo.component';


@NgModule({
  declarations: [
    SideBarComponent,
    AltaAlumnosComponent,
    CardCicloActualComponent,
    GruposComponent,
    IndexComponent,
    NivelEducativoComponent,
    CrearAlumnoEComponent,
    TutorEComponent,
    DatosEscuelaComponent,
    CambioGrupoComponent
        
  ],
  imports: [
    CommonModule,
    EscuelaAdminRoutingModule,
    RouterModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
    
  ], 
  providers: [DatePipe],
  entryComponents: [TutorEComponent],
  bootstrap: [TutorEComponent]
})
export class EscuelaAdminModule { }
