import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OAuthServiceService {

  constructor(
    private http:HttpClient
  ) { }

  GetAuthPage(): Promise<any>{
    const endpoint = `http://localhost:8000/oauth/AuthPage`;
      return this.http
              .get(endpoint, {withCredentials: true})
              .pipe(
                map( (res:any) => {
                  return res
                })
              )
              .toPromise();
  }

  getAcessToken(auth_code:string){
    const endpoint = `http://localhost:8000/oauth/getAccessToken`;
      return this.http
              .post(endpoint,{code:auth_code}, {withCredentials: true})
              .pipe(
                map( (res:any) => {
                  return res
                })
              )
              .toPromise();
  }

  getUserDetails(bindingGitHub: boolean){
    const endpoint = `http://localhost:8000/oauth/getUserDetails/${bindingGitHub}`;
      return this.http
              .get(endpoint, {withCredentials: true})
              .pipe(
                map( (res:any) => {
                  return res
                })
              )
              .toPromise();
  }

  logout(){
    const endpoint = `http://localhost:8000/oauth/logout`;
      return this.http
              .get(endpoint, {withCredentials: true})
              .pipe(
                map( (res:any) => {
                  return res
                })
              )
              .toPromise();
  }

}
