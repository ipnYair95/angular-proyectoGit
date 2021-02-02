import { Routes } from '@angular/router';
import { ListarComponent } from './components/listar/listar.component';
import { GradoComponent } from './components/listar/grado/grado.component';

export const rutasNivel: Routes = [
  {
    path: 'listar',    
    children: [      
      { path: '', component: ListarComponent },
      { path: 'grado/:nivel/:nombreCarrera/:idCicloEscolar', component: GradoComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' },
    ],
  },
  { path: 'listar', component: ListarComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'listar' },
];
