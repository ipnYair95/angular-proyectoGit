import { Routes, RouterModule } from '@angular/router'; 
import { NgModule } from '@angular/core';
import { ListarComponent } from './components/listar/listar.component';
import { GradoComponent } from './components/listar/grado/grado.component';

const routes: Routes = [
  {
     path: '',
     children: [
      { path: '', component: ListarComponent },
      { path: 'grado/:nivel/:nombreCarrera/:idCicloEscolar', component: GradoComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' },
      { path: '**', pathMatch: 'full', redirectTo: '' }
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NivelRoutingModule { }
  