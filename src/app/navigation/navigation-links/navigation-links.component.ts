import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../../auth/auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-navigation-links',
  templateUrl: './navigation-links.component.html',
  styleUrls: ['./navigation-links.component.css']
})
export class NavigationLinksComponent implements OnInit {
  @Input() displayIcons: boolean = false;

  // private onUserChangedSubscription: Subscription;
  isAuthenticated$: Observable<boolean>;
  // Used to only display the menu items once we know if we are logged in or not
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsAuthenticating);
    this.isAuthenticated$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  displayIcon(): boolean {
    return this.displayIcons;
  }

  onLogout() {
    this.authService.logout();
  }
}
