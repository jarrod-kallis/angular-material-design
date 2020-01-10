import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [AngularFireAuthModule, AuthRoutingModule, SharedModule]
})
export class AuthModule { }
