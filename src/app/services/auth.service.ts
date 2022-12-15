import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { async } from '@angular/core/testing';
import { CanActivate, Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService, private jwt: JwtHelperService, private route: Router) { }
  
  public auth(): Promise<boolean>{
    return new Promise((resolve, reject)=>{
      let token = localStorage.getItem('token');
      if(token == null){
        // this.route.navigate(['login']);
        reject(false);
      }
      if(this.jwt.isTokenExpired(token?.toString())){
        // this.route.navigate(['login']);
        reject(false);
      }
      this.apiService.execute({
        url: '/api/user/auth',
        method: 'GET',
        auth: true
      }).subscribe((res)=>{
        console.log(res);
        let result = (res != null);
        resolve(result);
      }, (err)=>{
        // this.route.navigate(['login']);
        reject(false);
      });
    });
  }
}
