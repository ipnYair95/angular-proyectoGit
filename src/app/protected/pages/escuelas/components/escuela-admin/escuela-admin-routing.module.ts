import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaAlumnosComponent } from './alta-alumnos/alta-alumnos.component';
import { DatosEscuelaComponent } from './datos-escuela/datos-escuela.component';
import { CrearAlumnoEComponent } from './grupos/crear-alumno/crear-alumno-e.component';
import { GruposComponent } from './grupos/grupos.component';
import { IndexComponent } from './index/index.component';
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';

const routes: Routes =  [
  { path: 'index', component: IndexComponent },
  {
    path: 'grupos',
    children: [
      { path: '', component: GruposComponent },
      { path: 'editar-alumno/:id', component: CrearAlumnoEComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' },
    ]
  },
  { path: 'datos-escuela', component: DatosEscuelaComponent },
  {
    path: 'niveles',
    children: [
      { path: '', component: NivelEducativoComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' },
    ],
  },
  {
    path: 'alumnos',
    children: [
      { path: '', component: AltaAlumnosComponent },
      { path: '**', pathMatch: 'full', redirectTo: '' },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'index' },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscuelaAdminRoutingModule { }
