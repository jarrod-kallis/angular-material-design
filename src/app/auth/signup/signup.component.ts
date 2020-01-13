import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formGroup: FormGroup;
  maxBirthdayDate: Date;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.formGroup = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'birthday': new FormControl('', [Validators.required]),
      'toc': new FormControl('', [Validators.requiredTrue])
    });

    this.maxBirthdayDate = new Date();
    return this.maxBirthdayDate.setFullYear(this.maxBirthdayDate.getFullYear() - 18);
  }

  onSubmit() {
    this.authService.signUp(
      this.formGroup.value.email,
      this.formGroup.value.password,
      this.formGroup.value.birthday
    );
  }

  getControl(name: string): AbstractControl {
    return this.formGroup.get(name);
  }

  get emailControl(): Function {
    return this.getControl.bind(this, 'email');
  }

  get passwordControl(): Function {
    return this.getControl.bind(this, 'password');
  }

  get birthdayControl(): Function {
    return this.getControl.bind(this, 'birthday');
  }

  private getCurrentEmailLength(): number {
    return this.formGroup.value.email.length;
  }

  displayEmailEmptyError(): boolean {
    return this.getCurrentEmailLength() === 0 && this.emailControl().touched;
  }

  displayEmailInvalidError(): boolean {
    return this.getCurrentEmailLength() > 0 && !this.emailControl().valid && this.emailControl().touched;
  }

  getCurrentPasswordLength(): number {
    return this.formGroup.value.password.length <= 6 ? this.formGroup.value.password.length : 6;
  }

  displayPasswordHint(): boolean {
    return this.getCurrentPasswordLength() === 0 && !this.passwordControl().touched;
  }

  displayPasswordEmptyError(): boolean {
    return this.getCurrentPasswordLength() === 0 && this.passwordControl().touched;
  }

  displayPasswordInvalidError(): boolean {
    return this.getCurrentPasswordLength() > 0 && !this.passwordControl().valid && this.passwordControl().touched;
  }

  private getCurrentBirthdayLength(): number {
    return this.formGroup.value.birthday ? this.formGroup.value.birthday.length : 0;
  }

  displayBirthdayHint(): boolean {
    return this.getCurrentBirthdayLength() === 0 && !this.birthdayControl().touched;
  }

  displayBirthdayEmptyError(): boolean {
    return this.getCurrentBirthdayLength() === 0 && this.birthdayControl().touched;
  }

  displayBirthdayInvalidError(): boolean {
    return this.getCurrentBirthdayLength() > 0 && !this.birthdayControl().valid && this.birthdayControl().touched;
  }
}
