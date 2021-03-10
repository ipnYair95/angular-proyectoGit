import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  titulo: string = "SISTEMA";
  existe: boolean;

  constructor(public authService: AuthService, private router: Router) {
    sessionStorage
   }

  ngOnInit(): void {
  }


  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  
}
