import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

import * as fromRoot from '../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuardService implements /*CanActivate,*/ CanLoad {

  constructor(
    private store: Store<fromRoot.State>
  ) { }

  // This is used for eagily loaded routes, and the module on the route is loaded before this is run
  // canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return this.authService.isAuthenticated() || this.router.createUrlTree(['login']);
  // }

  // This is used for lazy loaded routes, and is run before the module on the route is loaded
  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    // Navigation is done on AuthService.initFirebaseAuthListener()
    // return this.authService.isAuthenticated();
    return this.store.select(fromRoot.getIsAuthenticated)
      .pipe(
        first()
      );
  }
}
