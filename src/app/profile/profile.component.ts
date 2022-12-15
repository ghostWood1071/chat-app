import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { User } from '../entities/User';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';
import {config} from '../../env/env.config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public infoForm: FormGroup;
  public user: User;
  public temptUser: any;
  public loaded:any = false;
  public editorConfig:AngularEditorConfig;
  public file: File;
  public apiHost:string;
  constructor(private apiService: ApiService, private toast: ToastrService, private datePipe:DatePipe){
    this.temptUser = new User();
    this. editorConfig = {
      editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
          {class: 'arial', name: 'Arial'},
          {class: 'times-new-roman', name: 'Times New Roman'},
          {class: 'calibri', name: 'Calibri'},
          {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      uploadUrl: 'v1/image',
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['bold', 'italic'],
        ['fontSize']
      ]
    };
    this.apiHost = config.API_URL;
  }

  public bindDate(event: Event){
    return (event.target as HTMLInputElement).value;
  }

  private loadUser(){
    this.apiService.execute({
      method: 'GET',
      url: '/api/user/info',
      auth: true
    }).subscribe((res)=>{
      console.log(res);
      this.loaded = true;
      this.user = res as User;
      this.temptUser = {...this.user};
      console.log(this.temptUser);
      this.temptUser.birth = this.datePipe.transform(res.birth, "dd/MM/yyyy")
      // let day = new Date(res.birth);
      this.infoForm = new FormGroup({
        "name": new FormControl(this.temptUser.name, [Validators.required, Validators.minLength(8)]),
        "about": new FormControl(this.temptUser.about)
      });
      console.log(this.user);
    }, (err)=>{
      this.toast.error("unauthorize!")
    })
  }

  private equalVal (x: AbstractControl): { [key: string]: any } | null {
    if (x.value != this.temptUser.password) return { 'equalVal': true, 'requiredValue': '' };
    return null; 
  }

  ngOnInit(): void {
    this.loadUser();
    
    
  }

  public cancel(){
    this.temptUser = {...this.user};
  }

  public handleFileInput(event:any){
    this.file =  event.target.files[0]
    // this.apiService.execute({
    //   method: 'POST',
    //   url: 'api/user/uploadfile/',
    //   file: true,
    //   data: file
    // }).subscribe((data)=>{
    //   console.log(data);
    // },(err)=>{
    //   console.log(err);
    // })
  }

  public save(){
    if(this.file)
      this.apiService.execute({
        method: 'POST',
        url: '/api/user/uploadfile',
        file: true,
        data: this.file,
        auth: true
      }).subscribe((link)=>{
        let data = this.infoForm.value as User;
        console.log(data);
        
        data.avatar = link.file_name;
        let lol = localStorage.getItem('account');
        data.account = lol==null?"":lol ;
        this.apiService.execute({
          method: 'POST',
          url: '/api/user/changeprofile',
          data: data,
          auth: true
        }).subscribe((res)=>{
          this.user = res;
        }, (err)=>{
          this.toast.error("lỗi rồi");
        })
      },(err)=>{
        console.log(err);
      })
    else {
      let data = this.infoForm.value as User;
      this.apiService.execute({
        method: 'POST',
        url: '/api/user/changeprofile',
        data: data,
        auth: true
      }).subscribe((res)=>{
        this.user = res;
      }, (err)=>{
        this.toast.error("lỗi rồi");
      })
    }
  }
  
}
