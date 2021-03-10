import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';  
import { AlumnosModule } from './pages/alumnos/alumnos.module';
import { CardsComponent } from './pages/cards/components/cards/cards.component';
import { NivelModule } from './pages/nivel/nivel.module';
import { EscuelasModule } from './pages/escuelas/escuelas.module';


@NgModule({
  declarations: [DashboardComponent, CardsComponent],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    AlumnosModule,
    NivelModule,
    EscuelasModule
    
  ]
})
export class ProtectedModule { }
