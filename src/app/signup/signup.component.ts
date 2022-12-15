import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../entities/User';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  public user:User;
  public signUpForm: FormGroup;
  public apiHost:string;

  constructor(private apiService: ApiService, private router:Router, private toast: ToastrService){
    this.user = new User();
    this.signUpForm = new FormGroup({});
    
  }

  ngOnInit(): void {
    this.user = new User();
    this.signUpForm = new FormGroup({
      name: new FormControl('', Validators.required),
      account: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    }) 
  }

  public submit(){
    this.apiService.execute({
      method: 'POST',
      url: "/api/user/signup",
      data: this.user
    }).subscribe((res)=>{
      this.toast.success("oke");
      this.router.navigate(['/login'])
    }, (err)=>{
      this.toast.error(err);
      console.log(err);
    });
  }
}
