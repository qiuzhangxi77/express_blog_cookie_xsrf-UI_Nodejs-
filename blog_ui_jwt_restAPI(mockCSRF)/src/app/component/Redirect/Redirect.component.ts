import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';
import { UserService } from 'src/service/UserInformation';

@Component({
  selector: 'app-Redirect',
  templateUrl: './Redirect.component.html',
  styleUrls: ['./Redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(
    private _oauthService: OAuthServiceService,
    private _accountApiService: AccountApiServiceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) { }

  ngOnInit() {
    const binding = localStorage.getItem('binding');
    //注意 Redriect 会清掉searvice 相当于重启前端，尚不知道原因
    //userService.bindingGitHub
    if( binding === 'GitHub') {
      try {
        this._route.queryParamMap.pipe(
          concatMap(
            x =>  this._oauthService.getAcessToken(x.get('code') as string )
          )
        ).subscribe( async data => {
          // this._router.navigate(['gitLoginPage']);
          const result = await this._oauthService.getUserDetails(true);
          if( result.errno) {
            localStorage.removeItem('binding');
            localStorage.removeItem('userID');
            this._router.navigate(['/',0,'home'], {
            });
            console.log('This GitHub user have been bound')
            const message = "This GitHub user have been bound! "
            const action = "dismiss"
            this.openSnackBarWarn(message, action);
          }
          if(!result.errno) {
            const bindID = {
              userID: localStorage.getItem('userID'),
              GitHubID: result.data.GitHubID
            }
            const bindResult = await this._accountApiService.bindGitHub(bindID);
            if(!bindResult.errno) {
              this._userService.userInformation = bindResult.data.userInformation;
              this._userService.bindGitHubID = bindResult.data.GitHubID;
              console.log('receive jwt_token: ', bindResult.data.token);
              localStorage.setItem('jwt_token', bindResult.data.token);
              localStorage.setItem('loginOrigin', bindResult.data.userInformation.origin);
              localStorage.removeItem('binding');
              localStorage.removeItem('userID');
              this._router.navigate(['/',0,'home'], {
              });
              console.log('binding GitHub: jwt_token = ', result.data.token);
            }
          } 
        })
      } 
      catch (err) {
            console.log('Bind Github Failed')
            const message = "Bind Github Failed! "
            const action = "dismiss"
            this.openSnackBarWarn(message, action);
      }

      return ;
    }

    try {
       this._route.queryParamMap.pipe(
        concatMap(
          x =>  this._oauthService.getAcessToken(x.get('code') as string )
        )
      ).subscribe( async data => {
        // this._router.navigate(['gitLoginPage']);
        const result = await this._oauthService.getUserDetails(false);
        if(result.errno) {
          console.log('get github access token and login failed')
          const message = "User name or password is wrong "
          const action = "dismiss"
          this.openSnackBarWarn(message, action);
          this._router.navigate(['/login']);
        } else {
          console.log("Oauth User Login successful");
          localStorage.setItem('jwt_token', result.data.token);
          localStorage.setItem('loginOrigin', result.data.loginOrigin);
          console.log('localStorage.setItem: jwt_token = ', result.data.token);
          this._userService.userInformation = result.data.userInformation;
          this._userService.bindGitHubID = result.data.GitHubID;
          this._router.navigate(['/',0,'home'], {
        });
        }
      })

    } catch (err) {
      console.log('get github access token and login failed')
      const message = "User name or password is wrong "
      const action = "dismiss"
      this.openSnackBarWarn(message, action);
      this._router.navigate(['/login']);
    }
  }

  public openSnackBarWarn(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
