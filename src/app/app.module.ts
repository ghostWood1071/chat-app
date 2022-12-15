import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ScrollBotDirective } from './directives/scroll-bot.directive';
// s


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    ChatComponent,
    ScrollBotDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularEditorModule,

  ],
  providers: [
    ApiService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
