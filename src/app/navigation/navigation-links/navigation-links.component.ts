import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation-links',
  templateUrl: './navigation-links.component.html',
  styleUrls: ['./navigation-links.component.css']
})
export class NavigationLinksComponent implements OnInit, OnDestroy {
  @Input() displayIcons: boolean = false;

  private onUserChangedSubscription: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.onUserChangedSubscription = this.authService.onUserChangedEvent
      .subscribe(() => this.isAuthenticated = this.authService.isAuthenticated());
  }

  ngOnDestroy() {
    this.onUserChangedSubscription.unsubscribe();
  }

  displayIcon(): boolean {
    return this.displayIcons;
  }

  onLogout() {
    this.authService.logout();
  }
}
