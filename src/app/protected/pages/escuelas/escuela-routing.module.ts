import { Routes, RouterModule } from '@angular/router'; 
import { EscuelasComponent } from './components/escuelas.component'; 
import { NgModule } from '@angular/core'; 
import { SideBarCrudComponent } from './components/crud/side-bar-crud/side-bar-crud.component';
import { SideBarComponent } from './components/escuela-admin/side-bar/side-bar.component';

const routes: Routes = [
  {
    path: '',
    children: [
       { path: '', component: EscuelasComponent },
       {
         path: 'crud',
         component: SideBarCrudComponent,
         loadChildren: () => import('./components/crud/crud.module').then(m => m.CrudModule),
       },
       {
        path: 'escuela-admin',
        component: SideBarComponent,
        loadChildren: () => import('./components/escuela-admin/escuela-admin.module').then(m => m.EscuelaAdminModule),
      },
       { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscuelaRoutingModule { }



  /*
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
];*/
