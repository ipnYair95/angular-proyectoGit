import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './components/cards/cards.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CardsComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule
  ],
  exports:[
    CardsComponent
  ]
})
export class CardsModule { }
