import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { OAuthServiceService } from 'src/service/OAuthService/OAuthService.service';

@Component({
  selector: 'app-GitHubAuth',
  templateUrl: './GitHubAuth.component.html',
  styleUrls: ['./GitHubAuth.component.css']
})
export class GitHubAuthComponent implements OnInit {

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
  declarations: [GitHubAuthComponent],
  exports: [GitHubAuthComponent]
})
export class GitHubAuthComponentModule { }
