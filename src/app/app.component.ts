import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sideNav', { static: false }) sideNav: MatSidenav;

  toggleSideNav() {
    this.sideNav.toggle();
  }
}
