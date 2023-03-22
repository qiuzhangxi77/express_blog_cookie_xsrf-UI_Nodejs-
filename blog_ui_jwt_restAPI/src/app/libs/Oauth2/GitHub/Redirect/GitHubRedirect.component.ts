import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';
import { UserService } from 'src/service/UserInformation';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-gitHub-redirect',
    templateUrl: './GitHubRedirect.component.html',
    styleUrls: ['./GitHubRedirect.component.css'],
})
export class GitHubRedirectComponent implements OnInit {
    constructor(
        private _oauthService: OAuthServiceService,
        private _accountApiService: AccountApiServiceService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _userService: UserService
    ) {}

    public ngOnInit() {
        const GitHubStatus = localStorage.getItem('GitHubStatus');
        //注意 Redirect 会清掉service 相当于重启前端，尚不知道原因
        //userService.bindingGitHub
        console.log('GitHubRedirectComponent init');
        console.log('GitHubStatus: ', GitHubStatus);
        if (GitHubStatus === 'bind') {
            this.bindByGitHub();
        } else if (GitHubStatus === 'login') {
            this.loginByGitHub();
        }
    }

    public openSnackBarWarn(message: string, action: string) {
        this._snackBar.open(message, action);
    }

    public loginByGitHub() {
        try {
            this._route.queryParamMap
                .pipe(concatMap((x) => this._oauthService.getGitHubAccessToken(x.get('code') as string)))
                .subscribe(async (data) => {
                    // this._router.navigate(['gitLoginPage']);
                    console.log('using github user to login');
                    const result = await this._oauthService.getGitHubUserDetailsToLogin();
                    if (result.errno) {
                        console.log('get github access token and login failed');
                        const message = 'User name or password is wrong ';
                        const action = 'dismiss';
                        this._router.navigate(['/login']);
                        this.openSnackBarWarn(message, action);
                    } else {
                        console.log('Oauth User Login successful');
                        this._userService.userInformation = result.data.userInformation;
                        this._userService.bindOauth(result.data.oauthID, result.data.oauth);
                        this._router.navigate(['/', 0, 'home'], {});
                    }
                });
        } catch (err) {
            console.log('get github access token and login failed');
            const message = 'User name or password is wrong ';
            const action = 'dismiss';
            this.openSnackBarWarn(message, action);
            this._router.navigate(['/login']);
        }
        localStorage.removeItem('GitHubStatus');
    }

    public bindByGitHub() {
        const userID = localStorage.getItem('userID');
        console.log('binding: ', userID);
        try {
            this._route.queryParamMap
                .pipe(concatMap((x) => this._oauthService.getGitHubAccessToken(x.get('code') as string)))
                .subscribe(async (data) => {
                    // this._router.navigate(['gitLoginPage']);
                    const result = await this._oauthService.getGitHubUserDetailsToBind(userID as string);
                    if (result.errno) {
                        console.log('Binding github user to blog user failed');
                        const message = 'github user wrong or have been bound ';
                        const action = 'dismiss';
                        this._router.navigate(['/', 0, 'home'], {});
                        this.openSnackBarWarn(message, action);
                    } else {
                        console.log('Oauth User Login successful');
                        this._userService.userInformation = result.data.userInformation;
                        this._userService.bindOauth(result.data.oauthID, result.data.oauth);
                        this._router.navigate(['/', 0, 'home'], {});
                    }
                });
        } catch (err) {
            console.log('Bind Github Failed');
            const message = 'Bind Github Failed! ';
            const action = 'dismiss';
            this.openSnackBarWarn(message, action);
        }
        localStorage.removeItem('GitHubStatus');
        localStorage.removeItem('userID');
        return;
    }
}
