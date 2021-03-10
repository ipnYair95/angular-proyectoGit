import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorRoutingModule } from './tutor-routing.module';
import { AlumnoInfoComponent } from './alumno-info/alumno-info.component';
import { AlumnosModule } from '../alumnos/alumnos.module';
import { RouterModule } from '@angular/router';
import { CrearAlumnoComponent } from './crear-alumno/crear-alumno.component';
import { TutorComponent } from './crear-alumno/tutor/tutor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AlumnoInfoComponent, CrearAlumnoComponent, TutorComponent],
  imports: [
    CommonModule,
    TutorRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule

  ],
  entryComponents: [ TutorComponent ],
  bootstrap: [ TutorComponent ],
})
export class TutorModule { }
