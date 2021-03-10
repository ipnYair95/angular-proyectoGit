import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnosComponent } from './components/alumnos.component';
import { BuscarAlumnoComponent } from './components/buscar-alumno/buscar-alumno.component';
import { CrearAlumnoComponent } from './components/crear-alumno/crear-alumno.component';
import { ListarTodosComponent } from './components/listar-todos/listar-todos.component';

const routes: Routes = [
  {
    path: '',
    component: AlumnosComponent,
    children: [
      { path: 'listar', component: ListarTodosComponent },
      { path: 'buscar', component: BuscarAlumnoComponent },
      { path: 'crear', component: CrearAlumnoComponent },
      { path: 'crear/:id', component: CrearAlumnoComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'buscar' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnosRoutingModule { }
