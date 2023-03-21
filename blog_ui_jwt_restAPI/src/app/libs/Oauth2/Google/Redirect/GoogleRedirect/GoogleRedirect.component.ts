import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';
import { UserService } from 'src/service/UserInformation';

@Component({
  selector: 'app-GoogleRedirect',
  templateUrl: './GoogleRedirect.component.html',
  styleUrls: ['./GoogleRedirect.component.css']
})
export class GoogleRedirectComponent implements OnInit {

  constructor(
    private _oauthService: OAuthServiceService,
    private _accountApiService: AccountApiServiceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) { }

  public ngOnInit() {
    const GoogleStatus = localStorage.getItem('GoogleStatus');
    //注意 Redirect 会清掉service 相当于重启前端，尚不知道原因
    console.log("GoogleRedirectComponent init");
    console.log("GoogleStatus: ", GoogleStatus);
    if(GoogleStatus === 'bind') {
      this.bindByGoogle()
    } else if(GoogleStatus === 'login') {
      this.loginByGoogle();
    }
  }

  public openSnackBarWarn(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  public loginByGoogle() {
    try {
      console.log("this._route: ", this._route);
       this._route.queryParamMap.pipe(
        concatMap(
          x =>  {
            console.log("concatMap x: ", x);
            return this._oauthService.getGoogleAccessToken(x.get('code') as string );
          }
        )
      ).subscribe( async data => {
        // this._router.navigate(['gitLoginPage']);
        console.log("using google user to login");
        const result = await this._oauthService.getGoogleUserDetailsToLogin();
        if(result.errno) {
          console.log('get google access token and login failed');
          const message = "User name or password is wrong ";
          const action = "dismiss";
          this._router.navigate(['/login']);
          this.openSnackBarWarn(message, action);
        } else {
          console.log("Oauth User Login successful");
          this._userService.userInformation = result.data.userInformation;
          this._userService.bindOauth(result.data.oauthID, result.data.oauth);
          this._router.navigate(['/',0,'home'], {
        });
        }
      })
    } catch (err) {
      console.log('get google access token and login failed')
      const message = "User name or password is wrong "
      const action = "dismiss"
      this.openSnackBarWarn(message, action);
      this._router.navigate(['/login']);
    }
    localStorage.removeItem('GoogleStatus');
  }

  public bindByGoogle() {
    const userID = localStorage.getItem("userID");
    console.log("binding: ", userID);
    try {
      this._route.queryParamMap.pipe(
        concatMap(
          x =>  this._oauthService.getGoogleAccessToken(x.get('code') as string )
        )
      ).subscribe( async data => {
        // this._router.navigate(['gitLoginPage']);
        const result = await this._oauthService.getGoogleUserDetailsToBind(userID as string);
        if(result.errno) {
        console.log('Binding google user to blog user failed');
        const message = "google user wrong or have been bound ";
          const action = "dismiss";
          this._router.navigate(['/',0,'home'], {});
          this.openSnackBarWarn(message, action);
        } else {
          console.log("Oauth User Login successful");
          this._userService.userInformation = result.data.userInformation;
          this._userService.bindOauth(result.data.oauthID, result.data.oauth);
          this._router.navigate(['/',0,'home'], {});
          }
        })
      } 
    catch (err) {
          console.log('Bind Google Failed')
          const message = "Bind Google Failed! "
          const action = "dismiss"
          this.openSnackBarWarn(message, action);
    }
    localStorage.removeItem('GoogleStatus');
    localStorage.removeItem('userID');
    return ;
  }

}
