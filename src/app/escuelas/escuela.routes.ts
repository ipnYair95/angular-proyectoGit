import { Routes } from '@angular/router';
import { rutasEscuelaAdmin } from './components/escuela-admin/escuela-admin.routes';
import { rutasCrud } from './components/crud/escuela-admin.routes';
import { EscuelasComponent } from './components/escuelas.component';
import { SideBarComponent } from './components/escuela-admin/side-bar/side-bar.component';
import { SideBarCrudComponent } from './components/crud/side-bar-crud/side-bar-crud.component';

export const rutasEscuela: Routes = [
  {
    path: 'index',
    children: [
      { path: '', component: EscuelasComponent },
      { path: 'crud', component: SideBarCrudComponent, children: rutasCrud },
      {
        path: 'escuela-admin',
        component: SideBarComponent,
        children: rutasEscuelaAdmin,
      },
      { path: '**', pathMatch: 'full', redirectTo: '' },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'index' },
];
