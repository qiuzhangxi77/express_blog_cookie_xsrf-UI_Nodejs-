import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountApiServiceService } from '../AccountApiService.service';
import { OAuthServiceService } from '../OAuthService/OAuthService.service';
import { UserService } from '../UserInformation';

@Injectable({
    providedIn: 'root',
})
export class IsAuthenticatedService implements CanActivate {
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _accountApiService: AccountApiServiceService,
        private _oauthService: OAuthServiceService
    ) {}

    /**
     * Returns true if the user can access this route (i.e., they are not logged in yet).
     * Otherwise, if the user is already logged in, they are redirected to the home page.
     *
     * @param route The current route the user is trying to access.
     */
    public async canActivate(route: ActivatedRouteSnapshot) {
        if (await this.isUserLoggedIn()) {
            this._router.navigate(['0', 'home']);
            return false;
        }
        // Otherwise, allow them to continue (e.g., to the login page).
        return true;
    }

    /**
     * Returns true if the user is already logged in.  Otherwise, it returns false.
     *
     * @param route The current route the user is trying to access.
     */
    private async isUserLoggedIn() {
        try {
            const res = await this._accountApiService.getUserData();
            if (res.errno) {
                console.log('User have been not login and no have userInfo');
                return false;
            }
            console.log('User have been  login and  have userInfo');
            this._userService.userInformation = res.data;
            return true;
        } catch (error) {
            console.log('get UserInfo failed');
            return false;
        }
    }
}
