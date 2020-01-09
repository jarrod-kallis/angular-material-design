import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sideNav', { static: false }) sideNav: MatSidenav;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.initFirebaseAuthListener();
  }

  toggleSideNav() {
    this.sideNav.toggle();
  }
}
