import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material/material.module';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { EscuelaService } from './services/escuela.service';
import { EscuelasComponent } from './components/escuelas.component';
import { SideBarComponent } from './components/escuela-admin/side-bar/side-bar.component';
import { AltaAlumnosComponent } from './components/escuela-admin/alta-alumnos/alta-alumnos.component';
import { IndexComponent } from './components/escuela-admin/index/index.component';
import { DatosEscuelaComponent } from './components/escuela-admin/datos-escuela/datos-escuela.component';
import { NivelEducativoComponent } from './components/escuela-admin/nivel-educativo/nivel-educativo.component';

import { SideBarCrudComponent } from './components/crud/side-bar-crud/side-bar-crud.component';
import { IndexCrudComponent } from './components/crud/components/index-crud/index-crud.component';
import { EditarEscuelaComponent } from './components/crud/components/editar-escuela/editar-escuela.component';
import { NivelComponent } from './components/crud/components/nivel/nivel.component';

@NgModule({
  declarations: [
    // admin
    EscuelasComponent,
    SideBarComponent,
    AltaAlumnosComponent,
    IndexComponent,
    DatosEscuelaComponent,
    NivelEducativoComponent,
    // crud
    SideBarCrudComponent,
    IndexCrudComponent,
    EditarEscuelaComponent,
    NivelComponent

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  exports: [
    MaterialModule
  ],
  providers: [EscuelaService],
})
export class EscuelasModule {}
