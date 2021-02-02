import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/components/header/navbar.component';
import { AlumnosModule } from './alumnos/alumnos.module';
import { CardsModule } from './cards/cards.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';


import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NivelModule } from './nivel/nivel.module';
import { FooterComponent } from './layout/components/footer/footer.component';

import localeEs from '@angular/common/locales/es';
import { EscuelasModule } from './escuelas/escuelas.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './escuelas/material/material.module';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlumnosModule,
    NivelModule,
    CardsModule,
    EscuelasModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  exports:[
    AppRoutingModule,
    MaterialModule
  ],
  providers: [  { provide: LOCALE_ID, useValue: 'es' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
