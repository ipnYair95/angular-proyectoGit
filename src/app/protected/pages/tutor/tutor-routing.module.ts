import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoInfoComponent } from './alumno-info/alumno-info.component';
import { CrearAlumnoComponent } from './crear-alumno/crear-alumno.component';

const routes: Routes = [
  { path: '', component: AlumnoInfoComponent },  
  { path: 'info/:id', component: CrearAlumnoComponent },  
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorRoutingModule { }
