import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavItem } from './nav-item';
import { EscuelaService } from '../../../services/escuela.service';
import { Cct } from '../../models/cct';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnDestroy {

  escuela: Cct;

  menu: NavItem[] = [
    {
      displayName: 'Home',
      iconName: 'fa fa-home',
      route: 'index',
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
          displayName: 'Mis niveles',
          iconName: 'fa fa-layer-group',
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
          iconName: 'fa fa-plus',
          route: 'alumnos'
        }
      ]
    }
  ];

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cctService: EscuelaService,
    private router: Router
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 100%)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    if (this.cctService.validaUsuario()) {

      const id = (JSON.parse(sessionStorage.getItem('usuario')) as Cct).id;
      this.cctService.buscarPodId(id).subscribe(resp => {

        this.escuela = resp;
        console.log(this.escuela);

      })

    } else {
      this.router.navigateByUrl("../index");
    }

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
