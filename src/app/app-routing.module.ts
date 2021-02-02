import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardsComponent } from './cards/components/cards/cards.component';

import { AlumnosComponent } from './alumnos/components/alumnos.component';
import { rutasAlumno } from './alumnos/alumno.routes';

import { NivelComponent } from './nivel/components/nivel.component';
import { rutasNivel } from './nivel/nivel.routes';
import { rutasEscuela } from './escuelas/escuela.routes';

const routes: Routes = [
  { 
    path: 'alumnos', 
    component: AlumnosComponent, 
    children: rutasAlumno
  },
  { 
    path: 'nivel', 
    component: NivelComponent, 
    children: rutasNivel
  },
  { 
    path: 'escuela', 
    component: NivelComponent, 
    children: rutasEscuela
  },
  {path: 'index', component: CardsComponent },
  {path: '**', pathMatch: 'full', redirectTo: 'index'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
