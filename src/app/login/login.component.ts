import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import {ToastrService} from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public user: any;

  constructor(private apiService:ApiService, private toast:ToastrService, private auth: AuthService, private router:Router){
    this.loginForm = new FormGroup({});
  }

  ngOnInit(): void {

    this.auth.auth().then((t)=>{
      this.router.navigate(['']);
    }, (f)=>{});

    this.user = {} 
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  public onSubmit = ()=>{
    //console.log(this.loginForm.value)
    this.apiService.execute({
      method: 'POST',
      url: '/api/user/token',
      data: this.loginForm
    }).subscribe((res)=>{
      console.log(res);
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('account', this.loginForm.value.username);
      this.router.navigate(["/"]);
    }, (err)=>{
      this.toast.error(err.error.detail)
      console.log(err)
    }) 
  }
}
