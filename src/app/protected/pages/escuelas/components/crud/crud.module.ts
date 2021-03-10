import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarCrudComponent } from './side-bar-crud/side-bar-crud.component'; 
import { EditarEscuelaComponent } from './components/editar-escuela/editar-escuela.component';
import { IndexCrudComponent } from './components/index-crud/index-crud.component';
import { NivelComponent } from './components/nivel/nivel.component';
import { CrudRoutingModule } from './crud-routing.module';
import { MaterialModule } from 'src/app/ayudas/material/material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

 


@NgModule({
  declarations: [
    SideBarCrudComponent,
    EditarEscuelaComponent,
    IndexCrudComponent,
    NivelComponent 
  ],
  imports: [
    CommonModule,
    CrudRoutingModule,
    RouterModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
    
  ]
})
export class CrudModule { }
