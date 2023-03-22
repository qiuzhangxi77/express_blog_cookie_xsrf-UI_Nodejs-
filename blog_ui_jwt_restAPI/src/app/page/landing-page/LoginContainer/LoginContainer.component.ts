/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgModule, OnInit } from '@angular/core';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from 'src/service/UserInformation/UserInformation.service';
import { RegisterContainerComponent } from '../RegisterContainer/RegisterContainer.component';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';
@Component({
    selector: 'app-LoginContainer',
    templateUrl: './LoginContainer.component.html',
    styleUrls: ['./LoginContainer.component.css'],
})
export class LoginContainerComponent implements OnInit, AfterViewInit {
    public snackBarState = false;
    public gitHubAuthUrl: string | undefined;
    public googleAuthUrl: string | undefined;

    public inputForm = new FormGroup({
        userControl: new FormControl('', [Validators.required]),
        passwordControl: new FormControl('', [Validators.required]),
    });

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _accountApiService: AccountApiServiceService,
        private _snackBar: MatSnackBar,
        private _userService: UserService,
        private elementRef: ElementRef,
        private _oauthService: OAuthServiceService
    ) {}

    public ngOnInit() {
        try {
            this._oauthService.getGitHubAuthPage().subscribe((data) => (this.gitHubAuthUrl = data['authUrl']));
            this._oauthService.getGoogleAuthPage().subscribe((data) => (this.googleAuthUrl = data['authUrl']));
        } catch (err) {
            console.log('getAuthPage err: ', err);
        }
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit() {
        // test 同源政策的限制 和 CSRF
        //Verify CSRF attack
        // var ss = document.createElement("img");
        // ss.src ="http://localhost:8000/api/blog/list"
        // this.elementRef.nativeElement.appendChild(ss);
        // var s = document.createElement("script");
        // s.innerHTML=" document.getElementById('myForm').submit()";
        // this.elementRef.nativeElement.appendChild(s);
        // var s = document.createElement("script");
        // s.innerHTML+="var x = new XMLHttpRequest();"
        // s.innerHTML+="x.open('POST','http://localhost:8000/api/blog/new',true);"
        // s.innerHTML+="x.withCredentials = true;"
        // // s.innerHTML+=" x.setRequestHeader('Content-Type', 'application/json');"
        // s.innerHTML+="x.send('111');"
        // this.elementRef.nativeElement.appendChild(s);
        // var x = new XMLHttpRequest();
        // x.open('POST','http://localhost:8000/api/blog/new',true);
        // x.send('111');
        // Verify 脚本tag情况下产生的XMLHttpRequest GET是否会被同源政策限制
        // 结论 依然会限制XMLHttpRequest的请求
        // var s = document.createElement("script");
        // s.innerHTML+="var x = new XMLHttpRequest();"
        // s.innerHTML+="x.open('GET','http://localhost:8000/api/user/userInfo',true);"
        // s.innerHTML+="x.withCredentials = true;"
        // s.innerHTML+="x.send();"
        // this.elementRef.nativeElement.appendChild(s);
        // Verify 脚本tag情况下产生的XMLHttpRequest POST是否会被同源政策限制
        // 结论 依然会限制XMLHttpRequest的请求
        // let testData = JSON.stringify({
        //   name: "John",
        //   surname: "Smith"
        // });
        // var s = document.createElement("script");
        // s.innerHTML+="var x = new XMLHttpRequest();"
        // s.innerHTML+="x.open('POST','http://localhost:8000/api/user/testScriptXMLPost',true);"
        // s.innerHTML+="x.withCredentials = true;"
        // s.innerHTML+=" x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');"
        // // 'application/json' 非简单请求 application/x-www-form-urlencoded 简单请求
        // s.innerHTML+="x.send('id=123');"
        // this.elementRef.nativeElement.appendChild(s);
    }

    public async OnSubmit() {
        const userInformation = {
            username: this.inputForm.get('userControl')?.value,
            password: this.inputForm.get('passwordControl')?.value,
        };
        try {
            const result = await this._accountApiService.login(userInformation);
            //const data = await this._accountApiService.loginTest(userInformation);
            if (result.errno === 0) {
                console.log('Login successful');
                // this._router.navigate(['api/blog-list']);
                this._userService.userInformation = result.data.userInformation;
                console.log('this._userService.userInformation = ', this._userService.userInformation);
                this._router.navigate(['/', 0, 'home'], {});
            } else {
                console.log('Login failed');
                const message = 'User name or password is wrong ';
                const action = 'dismiss';
                this.openSnackBarWarn(message, action);
            }
        } catch (err) {
            console.log('Login err: ', err);
        }
    }

    public openSnackBarWarn(message: string, action: string) {
        this._snackBar.open(message, action);
        this.snackBarState = true;
        const valueChangeObj = this.inputForm.valueChanges.subscribe(() => {
            if (this._snackBar?._openedSnackBarRef) {
                this._snackBar.dismiss();
                this.snackBarState = false;
            }
        });

        const actionObservable = this._snackBar._openedSnackBarRef?.onAction().subscribe(() => {
            this.snackBarState = false;
            valueChangeObj.unsubscribe();
            actionObservable?.unsubscribe();
        });
    }

    public goToRegister() {
        this._router.navigate(['register'], {
            relativeTo: this._route.parent,
        });
    }

    public async loginWithGitHub() {
        localStorage.setItem('GitHubStatus', 'login');
        this._router.navigate(['/GitHubAuth'], { queryParams: { url: this.gitHubAuthUrl } });
    }

    public async loginWithGoogle() {
        localStorage.setItem('GoogleStatus', 'login');
        this._router.navigate(['/GoogleAuth'], { queryParams: { url: this.googleAuthUrl } });
    }
}

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
    declarations: [LoginContainerComponent],
    exports: [LoginContainerComponent],
})
export class LoginContainerModule {}
