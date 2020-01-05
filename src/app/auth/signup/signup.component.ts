import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formGroup: FormGroup;
  maxBirthdayDate: Date;

  constructor() { }

  ngOnInit() {
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
    console.log(this.formGroup.value);
  }

  private getCurrentEmailLength(): number {
    return this.formGroup.value.email.length;
  }

  displayEmailEmptyError(): boolean {
    const control: AbstractControl = this.formGroup.get('email');

    return this.getCurrentEmailLength() === 0 && control.touched;
  }

  displayEmailInvalidError(): boolean {
    const control: AbstractControl = this.formGroup.get('email');

    return this.getCurrentEmailLength() > 0 && !control.valid && control.touched;
  }

  private getCurrentPasswordLength(): number {
    return this.formGroup.value.password.length <= 6 ? this.formGroup.value.password.length : 6;
  }

  displayPasswordHint(): boolean {
    const control: AbstractControl = this.formGroup.get('password');

    return this.getCurrentPasswordLength() === 0 && !control.touched;
  }

  displayPasswordEmptyError(): boolean {
    const control: AbstractControl = this.formGroup.get('password');

    return this.getCurrentPasswordLength() === 0 && control.touched;
  }

  displayPasswordInvalidError(): boolean {
    const control: AbstractControl = this.formGroup.get('password');

    return this.getCurrentPasswordLength() > 0 && !control.valid && control.touched;
  }

  private getCurrentBirthdayLength(): number {
    return this.formGroup.value.birthday ? this.formGroup.value.birthday.length : 0;
  }

  displayBirthdayHint(): boolean {
    const control: AbstractControl = this.formGroup.get('birthday');

    return this.getCurrentBirthdayLength() === 0 && !control.touched;
  }

  displayBirthdayEmptyError(): boolean {
    const control: AbstractControl = this.formGroup.get('birthday');

    return this.getCurrentBirthdayLength() === 0 && control.touched;
  }

  displayBirthdayInvalidError(): boolean {
    const control: AbstractControl = this.formGroup.get('birthday');

    return this.getCurrentBirthdayLength() > 0 && !control.valid && control.touched;
  }
}
