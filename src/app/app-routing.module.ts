import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SignupComponent } from './signup/signup.component';
import {ChatComponent} from './chat/chat.component'

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  //{path: '', loadChildren: () => import('./main/main.module').then(m => m.MainModule)},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]}, 
  {path: '', component: ChatComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
