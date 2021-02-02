import { Routes } from '@angular/router';
import { DatosEscuelaComponent } from './datos-escuela/datos-escuela.component';
import { IndexComponent } from './index/index.component';
import { NivelEducativoComponent } from './nivel-educativo/nivel-educativo.component';
import { AltaAlumnosComponent } from './alta-alumnos/alta-alumnos.component';


export const rutasEscuelaAdmin: Routes = [
  { path: 'index', component: IndexComponent },
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
