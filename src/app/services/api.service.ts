import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { config } from 'src/env/env.config';
import { useAnimation } from '@angular/animations';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {
  }
  
  private getToken(){
    return localStorage.getItem('token')
  }

  private getFormData(form: FormGroup){
    let data: any = form.value;
    console.log(data);
    let result:string = "";
    for(let key in data){
      result+=key+"="+data[key]+"&"
    }
    result = result.slice(0, result.length-1)
    return result;
  }

  public execute(params: any) {    
    params['isForm'] = false;
    if(params['data'])
      params['isForm'] = params['data'] instanceof FormGroup;
    let opts:any = {}
    let data: any = {}
    let headers:any = {}
    params['url'] = config.API_URL+params['url'];

    if (params['auth']){
      headers = {
        accept: 'application/json',
        Authorization: 'Bearer '+this.getToken()
      }
      if (params['isForm']) headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if(params['isForm']){
      headers = {accept: 'application/json', 'Content-Type':'application/x-www-form-urlencoded'};
    }
    opts['headers'] = new HttpHeaders(headers);
    //data
    if(params['isForm'])
      data = this.getFormData(params['data'])
    else
      data = params['data']

    if (params['method'] == 'POST'){
      if(params['file'])
        return this.postFile(params['url'], data, opts);
      return this.post(params['url'], data, opts);
    }
    return this.get(params['url'], opts)
  }

  private post(url: string, data: any, opts: any){
    // opts.headers['method'] = 'POST'
    return this.http.post<any>(url, data, opts).pipe(map((res:any)=>{
      return res;
    })).pipe(catchError((err)=>{
        throw err;
    }));
  }

  private get(url: string, opts:any){
    return this.http.get<any>(url, opts).pipe(map((res:any)=>{
      return res;
    })).pipe(catchError((err)=>{
      throw err;
    }))
  }

  private postFile(url:string, file: File, opts:any){
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http
    .post(url, formData, opts)
    .pipe(map((res)=>{
      return res;
    })).pipe(catchError((err)=>{
      throw err;
    }))
  }
}
