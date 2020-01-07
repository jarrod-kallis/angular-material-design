import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    this.authService.login(this.formGroup.value.email, this.formGroup.value.password);
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

  displayEmailEmptyError(): boolean {
    return !this.emailControl().valid && this.emailControl().touched;
  }

  displayPasswordEmptyError(): boolean {
    return !this.passwordControl().valid && this.passwordControl().touched;
  }
}
