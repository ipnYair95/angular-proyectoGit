import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavItem } from '../../escuela-admin/side-bar/nav-item';
import { Cct } from '../../models/cct';
import { MediaMatcher } from '@angular/cdk/layout';
import { EscuelaService } from '../../../services/escuela.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar-crud',
  templateUrl: './side-bar-crud.component.html',
  styleUrls: ['./side-bar-crud.component.css']
})
export class SideBarCrudComponent implements OnDestroy {

  escuela: Cct;

  menu: NavItem[] = [
    {
      displayName: 'Inicio',
      iconName: 'fa fa-home',
      route: 'index',
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
