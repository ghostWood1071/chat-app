import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth:AuthService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return this.auth.auth().then((val)=> {
      return val;
    }, (re)=>{
      this.router.navigate(['login']);
      return re;
    })
  }
}
