import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { UserService } from 'src/service/UserInformation';

@Component({
  selector: 'app-RegisterContainer',
  templateUrl: './RegisterContainer.component.html',
  styleUrls: ['./RegisterContainer.component.css']
})
export class RegisterContainerComponent implements OnInit {
  public snackBarState = false;

  public inputForm = new FormGroup({
    realNameControl: new FormControl('', [Validators.required]),
    userControl: new FormControl('', [Validators.required]),
    passwordControl: new FormControl('', [Validators.required])
  });

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _accountApiService: AccountApiServiceService,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) { }

  ngOnInit() {
  }

  public async OnSubmit() {
    const userInformation = {
      realname: this.inputForm.get("realNameControl")?.value,
      username: this.inputForm.get("userControl")?.value,
      password: this.inputForm.get("passwordControl")?.value,
    }
    try {
      const result = await this._accountApiService.register(userInformation);
      if(result.errno === 0) {
        console.log("Register successful");
        this._router.navigate(['/login'], {
        });
      } else {
        console.log("Register failed")
        const message = "userName/userAccount already exists"
        const action = "dismiss"
        this.openSnackBarWarn(message, action);
      }
    } catch (err) {
      console.log("Register err: ", err)
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

  public goToLogin() {
    this._router.navigate(['login'], {
        relativeTo: this._route.parent
    });
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
  declarations: [RegisterContainerComponent],
  exports: [RegisterContainerComponent]
})
export class RegisterContainerModule { }