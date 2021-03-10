import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { BuscarAlumnoComponent } from './components/buscar-alumno/buscar-alumno.component'; 
import { ListarTodosComponent } from './components/listar-todos/listar-todos.component';
import { AlumnosComponent } from './components/alumnos.component'; 
import { RouterModule } from '@angular/router';
import { CrearAlumnoComponent } from './components/crear-alumno/crear-alumno.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { TutorComponent } from './components/crear-alumno/tutor/tutor.component';
import { AlumnosRoutingModule } from './alumnos-routing.module';

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
    AlumnosRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports:[
    CrearAlumnoComponent
  ],
  entryComponents: [ TutorComponent ],
  bootstrap: [ TutorComponent ],
})
export class AlumnosModule { }
