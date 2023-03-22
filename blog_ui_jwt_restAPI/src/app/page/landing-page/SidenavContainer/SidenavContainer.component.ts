import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { UserService } from 'src/service/UserInformation/UserInformation.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';

export interface sidenavList {
    name: string;
    icon: string;
    route: string;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'sidenav-Container',
    templateUrl: './SidenavContainer.component.html',
    styleUrls: ['./SidenavContainer.component.css'],
})
export class SidenavComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav', { static: true })
    public sidenav!: MatSidenav;
    @ViewChild('sidenavContainer', { static: false })
    public sideNavContainer!: MatSidenavContainer;
    public events: string[] = [];
    public opened: boolean = false;
    public config: PerfectScrollbarConfigInterface = {};
    public menuList: sidenavList[] = [
        {
            name: 'My Blog',
            icon: 'contact_page',
            route: 'api/myBlog-list',
        },
        {
            name: 'Blog List',
            icon: 'view_list',
            route: 'api/blog-list',
        },
        {
            name: 'Personal Center',
            icon: 'account_circle',
            route: 'api/personal-center',
        },
        {
            name: 'Settings',
            icon: 'settings',
            route: 'api/settings',
        },
    ];
    public loginOrigin = '';
    public gitHubAuthUrl: string | undefined;
    public googleAuthUrl: string | undefined;

    constructor(
        public userService: UserService,
        private _accountApiService: AccountApiServiceService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _oauthService: OAuthServiceService
    ) {}

    public async ngOnInit() {
        try {
            this._oauthService.getGitHubAuthPage().subscribe((data) => (this.gitHubAuthUrl = data['authUrl']));
            this._oauthService.getGoogleAuthPage().subscribe((data) => (this.googleAuthUrl = data['authUrl']));
        } catch (err) {
            console.log('getAuthPage err: ', err);
        }
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    public ngOnDestroy() {}

    public async OnSubmit() {
        try {
            const result = await this._accountApiService.loginTest();
            if (result.errno === 0) {
                console.log('Login test successful');
            } else {
                console.log('Login test failed');
            }
        } catch (err) {
            console.log('Login test err');
        }
    }

    public closeSideNav() {
        this.sidenav.close();
    }

    public async logout() {
        this.userService.clearUserInformation();
        try {
            const res = await this._accountApiService.logout();
            console.log('logout with github user successfully');
        } catch (err) {
            console.log('logout with github user failed');
        }
        this._router.navigate(['login'], {
            relativeTo: this._route.parent,
        });
    }

    //todo
    //绑定github user 到本地用户
    //step 1 判断是否已经登录了本地账户
    //如果不是则是未登录的情况，回到前面即使用第三方登录
    //step2 如果已经登录，获取github 用户信息。
    //back-end：如果查询到该网站有此github用户信息则返回已经绑定过此github账号
    //back-end：如果查询到该网站没有此github用户信息则绑定

    public async BindGitHub() {
        localStorage.setItem('GitHubStatus', 'bind');
        localStorage.setItem('userID', this.userService.userInformation.userID);
        console.log("this._router.navigate(['../GitHubAuth']: ", this.gitHubAuthUrl);
        this._router.navigate(['/GitHubAuth'], { queryParams: { url: this.gitHubAuthUrl } });
    }

    public async BindGoogle() {
        localStorage.setItem('GoogleStatus', 'bind');
        localStorage.setItem('userID', this.userService.userInformation.userID);
        console.log("this._router.navigate(['../GoogleAuth']: ", this.googleAuthUrl);
        this._router.navigate(['/GoogleAuth'], { queryParams: { url: this.googleAuthUrl } });
    }
}

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        PerfectScrollbarModule,
        MatListModule,
        RouterModule,
        MatMenuModule,
    ],
    declarations: [SidenavComponent],
    exports: [SidenavComponent],
})
export class SidenavComponentModule {}
