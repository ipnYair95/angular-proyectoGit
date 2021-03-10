import { NgModule } from '@angular/core';
import { EscuelasComponent } from './components/escuelas.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EscuelaRoutingModule } from './escuela-routing.module';
import { CrudModule } from './components/crud/crud.module';
import { EscuelaAdminModule } from './components/escuela-admin/escuela-admin.module';



@NgModule({
  declarations: [
    EscuelasComponent
  ],
  imports: [
   CommonModule,
   RouterModule,
   EscuelaRoutingModule,
   CrudModule,
   EscuelaAdminModule
  ]  
})
export class EscuelasModule { }

