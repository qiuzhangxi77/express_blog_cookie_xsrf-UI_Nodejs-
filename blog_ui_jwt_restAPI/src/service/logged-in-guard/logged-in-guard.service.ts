import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountApiServiceService } from '../AccountApiService.service';
import { OAuthServiceService } from '../OAuthService/OAuthService.service';
import { UserService } from '../UserInformation';

@Injectable({
    providedIn: 'root',
})
export class LoggedInGuardService implements CanActivate {
    constructor(private _userService: UserService, private _accountApiService: AccountApiServiceService, private _router: Router) {}
    public async canActivate(route: ActivatedRouteSnapshot) {
        if (await this.checkUserData(route)) {
            return true;
        }
        this._router.navigate(['/login']);
        return false;
    }

    public async checkUserData(route: ActivatedRouteSnapshot) {
        try {
            if (!this._userService.userInformation.userID) {
                const res = await this._accountApiService.getUserData();
                if (res.errno === 1) {
                    console.log('User have been not login and no have userInfo');
                    return false;
                }
                this._userService.userInformation = res.data;
            }
            console.log('User have been  login and  have userInfo');
            return true;
        } catch (error) {
            console.log('get UserInfo failed');
            this._router.navigate(['/']);
            return false;
        }
    }
}
