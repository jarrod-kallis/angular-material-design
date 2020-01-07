import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  private _onUserChangedEvent = new Subject<void>();

  constructor(private router: Router) { }

  public get user(): User {
    return { ...this._user }
  }

  public get onUserChangedEvent(): Subject<void> {
    return this._onUserChangedEvent;
  }

  private emitUserChangedEvent() {
    this._onUserChangedEvent.next();

    if (this.isAuthenticated()) {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['login']);
    }
  }

  signUp(email: string, password: string, birthday: Date): void {
    this._user = new User(email, birthday);
    this.emitUserChangedEvent();
  }

  login(email: string, password: string): void {
    this._user = new User(email);
    this.emitUserChangedEvent();
  }

  logout(): void {
    this._user = null;
    this.emitUserChangedEvent();
  }

  isAuthenticated(): boolean {
    return !!this._user;
  }
}
