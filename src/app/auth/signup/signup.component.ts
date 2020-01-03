import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formGroup: FormGroup;

  constructor() { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }

  getCurrentEmailLength(): number {
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

  getCurrentPasswordLength(): number {
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
}
