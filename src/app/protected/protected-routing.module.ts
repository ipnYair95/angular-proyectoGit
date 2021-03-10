import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';    
import { CardsComponent } from './pages/cards/components/cards/cards.component'; 
import { TipoUsuarioGuard } from '../guards/tipo-usuario.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'index', component: CardsComponent
      },    
      {
        path: 'alumno-module',
        loadChildren: () => import('./pages/tutor/tutor.module').then(m => m.TutorModule),                
      },
      {
        path: 'alumnos',
        loadChildren: () => import('./pages/alumnos/alumnos.module').then(m => m.AlumnosModule),        
        canActivate: [ TipoUsuarioGuard ],
        canLoad: [ TipoUsuarioGuard ]
      },
      {
        path: 'nivel-educativo',
        loadChildren: () => import('./pages/nivel/nivel.module').then(m => m.NivelModule),
        canActivate: [ TipoUsuarioGuard ],
        canLoad: [ TipoUsuarioGuard ]
      }, 
      {
        path: 'escuela',
        loadChildren: () => import('./pages/escuelas/escuelas.module').then(m => m.EscuelasModule),
        canActivate: [ TipoUsuarioGuard ],
        canLoad: [ TipoUsuarioGuard ]
      },
      { path: '**', redirectTo: 'index' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedRoutingModule {}
