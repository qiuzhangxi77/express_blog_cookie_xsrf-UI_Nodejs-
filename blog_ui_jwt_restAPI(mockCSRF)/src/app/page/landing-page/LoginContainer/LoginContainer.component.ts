import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgModule, OnInit } from '@angular/core';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { UserService } from 'src/service/UserInformation/UserInformation.service';
import { RegisterContainerComponent } from '../RegisterContainer/RegisterContainer.component';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';
@Component({
  selector: 'app-LoginContainer',
  templateUrl: './LoginContainer.component.html',
  styleUrls: ['./LoginContainer.component.css']
})
export class LoginContainerComponent implements OnInit, AfterViewInit {
  public snackBarState = false;

  public inputForm = new FormGroup({
    userControl: new FormControl('', [Validators.required]),
    passwordControl: new FormControl('', [Validators.required])
  });


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _accountApiService: AccountApiServiceService,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private elementRef:ElementRef,
    private _oauthService: OAuthServiceService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // 因为静态script、form的submit只能放在<head><body>之内，放到其它地方如app-root嵌套里都不生效，改成动态执行
    // testCSRF

    // Verify CSRF GET attack
    // var ss = document.createElement("img");
    // ss.src = "http://localhost:8000/api/blog/list"
    // this.elementRef.nativeElement.appendChild(ss);

    // // Verify CSRF form POST attack
    // var form = document.createElement("form");
    // form.action = "http://localhost:8000/api/blog/1648877106088_0.32786482411016116/new";
    // form.enctype = "application/x-www-form-urlencoded";
    // form.method = "POST";
    // form.id = "myCSRFform"
    // var title = document.createElement("input");
    // title.type = "text";
    // title.name = "title";
    // title.value = "CSRFtitle";
    // var submit = document.createElement("input");
    // submit.type = "submit";
    // form.appendChild(title);
    // form.appendChild(submit);
    // this.elementRef.nativeElement.appendChild(form);
    // form.submit();
    // form可以放在html里，再用动态脚本执行submit
    // var s = document.createElement("script");
    // s.innerHTML=" document.getElementById('myCSRFform').submit()";
    // this.elementRef.nativeElement.appendChild(s);

    // Verify CSRF form link attack
    // var a = document.createElement("a");
    // a.href = "http://localhost:8000/api/blog/list";
    // a.text = "重磅消息！！！"
    // this.elementRef.nativeElement.appendChild(a);


    // test 同源政策的限制
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
      username: this.inputForm.get("userControl")?.value,
      password: this.inputForm.get("passwordControl")?.value,
    }
    try {
      const result = await this._accountApiService.login(userInformation);
      //const data = await this._accountApiService.loginTest(userInformation);
      if(result.errno === 0) {
        console.log("Login successful");
        // this._router.navigate(['api/blog-list']);
        localStorage.setItem('jwt_token', result.data.token);
        localStorage.setItem('loginOrigin', result.data.userInformation.origin);
        console.log('localStorage.setItem: jwt_token = ', result.data.token);
        this._userService.userInformation = result.data.userInformation;
        this._router.navigate(['/',0,'home'], {
        });
      } else {
        console.log("Login failed")
        const message = "User name or password is wrong "
        const action = "dismiss"
        this.openSnackBarWarn(message, action);
      }
    } catch (err) {
      console.log("Login err: ", err)
    }
  }

  public openSnackBarWarn(message: string, action: string) {
    this._snackBar.open(message, action);
    this.snackBarState = true;
    const valueChangeObj = this.inputForm.valueChanges.subscribe( ()=>{
      if( this._snackBar?._openedSnackBarRef) {
        this._snackBar.dismiss()
        this.snackBarState = false;
      }
    })

    const actionObservable = this._snackBar._openedSnackBarRef?.onAction().subscribe( ()=>{
      this.snackBarState = false;
      valueChangeObj.unsubscribe();
      actionObservable?.unsubscribe();
      })
  }

  public goToRegister() {
    this._router.navigate(['register'], {
        relativeTo: this._route.parent
    });
  }
  
  public async loginGitHub() {
    var authUrl  = '';
    try {
      const result = await this._oauthService.GetAuthPage();
      if(result.authUrl) {
        authUrl = result.authUrl;
      }
      this._router.navigate(['/test'],{queryParams:{url:authUrl}});
    } catch (err) {
      console.log("GetAuthPage err: ", err)
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  declarations: [LoginContainerComponent],
  exports: [LoginContainerComponent]
})
export class LoginContainerModule { }
