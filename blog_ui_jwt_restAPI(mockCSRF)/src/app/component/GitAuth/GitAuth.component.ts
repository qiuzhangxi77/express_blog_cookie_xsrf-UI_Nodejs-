import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';

@Component({
  selector: 'app-GitAuth',
  templateUrl: './GitAuth.component.html',
  styleUrls: ['./GitAuth.component.css']
})
export class GitAuthComponent implements OnInit {

  constructor(

  ) { }

  async ngOnInit() {
  }

}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule
  ],
  declarations: [GitAuthComponent],
  exports: [GitAuthComponent]
})
export class GitAuthComponentModule { }
