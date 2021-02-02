import { Routes } from '@angular/router';
import { IndexCrudComponent } from './components/index-crud/index-crud.component';
import { EditarEscuelaComponent } from './components/editar-escuela/editar-escuela.component'; 
import { NivelComponent } from './components/nivel/nivel.component';

export const rutasCrud: Routes = [
  { path: 'index', component: IndexCrudComponent },
  { path: 'crear', component: EditarEscuelaComponent },
  { path: 'editar/:id', component: EditarEscuelaComponent },
  { path: 'nivel/:id', component: NivelComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'index' },
];

