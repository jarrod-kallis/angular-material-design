import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';

import { TrainingService } from '../training/training.service';
import { GuiService } from '../shared/services/gui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated: boolean = false;
  private _onUserChangedEvent = new Subject<void>();

  constructor(
    private router: Router,
    private firebaseAuthService: AngularFireAuth,
    private trainingService: TrainingService,
    private guiService: GuiService,
    private snackBar: MatSnackBar
  ) { }

  public get onUserChangedEvent(): Subject<void> {
    return this._onUserChangedEvent;
  }

  public initFirebaseAuthListener() {
    this.firebaseAuthService.authState
      .subscribe(userData => {
        console.log(userData);
        if (userData) {
          this._isAuthenticated = true;
          this.router.navigate(['training/new']);
        } else {
          this._isAuthenticated = false;
          this.trainingService.unsubscribe();
          this.router.navigate(['login']);
        }

        this._onUserChangedEvent.next();
      });
  }

  signUp(email: string, password: string, birthday: Date): void {
    this.guiService.isLoading = true;

    this.firebaseAuthService.auth
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.snackBar.open(error.message, 'Okay');
      })
      .finally(() => this.guiService.isLoading = false);
  }

  login(email: string, password: string): void {
    this.guiService.isLoading = true;

    this.firebaseAuthService.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.snackBar.open(error.message, 'Okay');
      })
      .finally(() => this.guiService.isLoading = false);
  }

  logout(): void {
    this.firebaseAuthService.auth.signOut();
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
