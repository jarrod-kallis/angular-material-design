import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';

import { GuiService } from '../shared/services/gui.service';
import * as fromAuth from './store/auth.reducer';
import { LoggedIn, LoggedOut, Authenticating } from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private firebaseAuthService: AngularFireAuth,
    private guiService: GuiService,
    private store: Store<fromAuth.State>
  ) { }

  public initFirebaseAuthListener() {
    this.store.dispatch(new Authenticating());

    this.firebaseAuthService.authState
      .subscribe(userData => {
        // console.log(userData);
        if (userData) {
          this.isAuthenticated = true;
          this.router.navigate(['training/new']);
        } else {
          this.isAuthenticated = false;
          this.router.navigate(['login']);
        }
      });
  }

  signUp(email: string, password: string, birthday: Date): void {
    this.guiService.isLoading = true;

    this.handleSignUpOrLogin(this.firebaseAuthService.auth
      .createUserWithEmailAndPassword(email, password));
  }

  login(email: string, password: string): void {
    this.guiService.isLoading = true;

    this.handleSignUpOrLogin(this.firebaseAuthService.auth
      .signInWithEmailAndPassword(email, password));
  }

  handleSignUpOrLogin(authAction: Promise<firebase.auth.UserCredential>): void {
    authAction
      .catch(error => {
        this.guiService.showSnackBar(error.message, 'Okay');
      })
      .finally(() => this.guiService.isLoading = false);
  }

  logout(): void {
    this.firebaseAuthService.auth.signOut()
      .then(() => {
        // Eliminate the 'FirebaseError: Missing or insufficient permissions'
        // https://medium.com/@dalenguyen/handle-missing-or-insufficient-permissions-firestore-error-on-angular-or-ionic-bf4edb7a7c68
        window.location.reload();
      });
  }

  private set isAuthenticated(value: boolean) {
    this.store.dispatch(value ? new LoggedIn() : new LoggedOut());
  }
}
