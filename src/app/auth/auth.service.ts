import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

import { TrainingService } from '../training/training.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated: boolean = false;
  private _onUserChangedEvent = new Subject<void>();

  constructor(private router: Router, private firebaseAuthService: AngularFireAuth, private trainingService: TrainingService) { }

  public get onUserChangedEvent(): Subject<void> {
    return this._onUserChangedEvent;
  }

  public initFirebaseAuthListener() {
    this.firebaseAuthService.authState
      .subscribe(userData => {
        console.log(userData);
        if (userData) {
          this._isAuthenticated = true;
          this.router.navigate(['']);
        } else {
          this._isAuthenticated = false;
          this.trainingService.unsubscribe();
          this.router.navigate(['login']);
        }

        this._onUserChangedEvent.next();
      });
  }

  signUp(email: string, password: string, birthday: Date): void {
    this.firebaseAuthService.auth.createUserWithEmailAndPassword(email, password)
      .catch(error => console.error(error));
  }

  login(email: string, password: string): void {
    this.firebaseAuthService.auth.signInWithEmailAndPassword(email, password)
      .catch(error => console.error(error));
  }

  logout(): void {
    this.firebaseAuthService.auth.signOut();
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
}
