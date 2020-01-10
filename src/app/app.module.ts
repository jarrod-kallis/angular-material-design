import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NavigationLinksComponent } from './navigation/navigation-links/navigation-links.component';
import { NavigationToolbarComponent } from './navigation/navigation-toolbar/navigation-toolbar.component';
import { NavigationLinkComponent } from './navigation/navigation-links/navigation-link/navigation-link.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NavigationLinksComponent,
    NavigationToolbarComponent,
    NavigationLinkComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
