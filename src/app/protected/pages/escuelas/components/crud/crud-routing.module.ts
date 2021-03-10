import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditarEscuelaComponent } from './components/editar-escuela/editar-escuela.component';
import { IndexCrudComponent } from './components/index-crud/index-crud.component';
import { NivelComponent } from './components/nivel/nivel.component';

const routes: Routes = [
  { path: 'index', component: IndexCrudComponent },
  { path: 'crear', component: EditarEscuelaComponent },
  { path: 'editar/:id', component: EditarEscuelaComponent },
  { path: 'nivel/:id', component: NivelComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'index' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrudRoutingModule { }
