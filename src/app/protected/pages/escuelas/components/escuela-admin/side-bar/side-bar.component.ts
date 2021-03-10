import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavItem } from './nav-item';
import { EscuelaService } from '../../../services/escuela.service';
import { Cct } from '../../models/cct'; 
import { Router } from '@angular/router';



@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {

  escuela: Cct;

  menu: NavItem[] = [
    {
      displayName: 'Home',
      iconName: 'fa fa-home',
      route: 'index',
    },
    {
      displayName: 'Grupos',
      iconName: 'fa fa-users',
      children: [
        {
          displayName: 'Ver grupos',
          iconName: 'fa fa-users',
          route: 'grupos'
        } 
      ]
    },
    {
      displayName: 'Datos del inmueble',
      iconName: 'fa fa-address-card',
      route: 'datos-escuela',
    },
    {
      displayName: 'Nivel educativo',
      iconName: 'fa fa-layer-group',
      children: [
        {
          displayName: 'Crear grupos',
          iconName: 'fa fa-users',
          route: 'niveles'
        }
      ]
    },
    {
      displayName: 'Alumnos',
      iconName: 'fa fa-user-graduate',
      children: [
        {
          displayName: 'Alta de alumnos',
          iconName: 'fa fa-user-plus',
          route: 'alumnos'
        }
      ]
    }
  ];


  constructor(
   
    private cctService: EscuelaService,
    private router: Router
  ) {

    this.escuela = JSON.parse(sessionStorage.getItem('usuario')) as Cct

  }

}
