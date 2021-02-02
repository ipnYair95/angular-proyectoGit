import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './components/listar/listar.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NivelComponent } from './components/nivel.component';
import { InfoCarreraComponent } from './components/modals/info-carrera/info-carrera.component';
import { InfoNivelComponent } from './components/modals/info-nivel/info-nivel.component';
import { GradoComponent } from './components/listar/grado/grado.component';
import { InfoCicloEscolarComponent } from './components/modals/info-ciclo-escolar/info-ciclo-escolar.component';
import { BrowserModule } from '@angular/platform-browser';
import { InfoAsignaturaComponent } from './components/modals/info-asignatura/info-asignatura.component';




@NgModule({
  declarations: [
    ListarComponent,
    NivelComponent,
    GradoComponent,
    InfoCarreraComponent,
    InfoNivelComponent,
    InfoCicloEscolarComponent,
    InfoAsignaturaComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule
  ],
  entryComponents: [ InfoCarreraComponent, InfoNivelComponent, InfoCicloEscolarComponent, InfoAsignaturaComponent ],
  bootstrap: [ InfoCarreraComponent, InfoNivelComponent, InfoCicloEscolarComponent, InfoAsignaturaComponent ]
})
export class NivelModule {}
