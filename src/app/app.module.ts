import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/components/header/navbar.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';


import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { FooterComponent } from './layout/components/footer/footer.component';

import localeEs from '@angular/common/locales/es'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MaterialModule } from './ayudas/material/material.module';
import { ProtectedModule } from './protected/protected.module';
import { LayoutModule } from './layout/layout.module';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,   
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ProtectedModule,
    LayoutModule
  ],
  exports:[
    AppRoutingModule,
    MaterialModule
  ],
  providers: [  { provide: LOCALE_ID, useValue: 'es' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
