import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListarTodosComponent } from './components/listar-todos/listar-todos.component';
import { AlumnosComponent } from './components/alumnos.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { BuscarAlumnoComponent } from './components/buscar-alumno/buscar-alumno.component';
import { CrearAlumnoComponent } from './components/crear-alumno/crear-alumno.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms'; 
import { TutorComponent } from './components/crear-alumno/tutor/tutor.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  declarations: [
    AlumnosComponent,
    ListarTodosComponent,
    BuscarAlumnoComponent,
    CrearAlumnoComponent, 
    TutorComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  entryComponents: [ TutorComponent ],
  bootstrap: [ TutorComponent ],
})
export class AlumnosModule {}
