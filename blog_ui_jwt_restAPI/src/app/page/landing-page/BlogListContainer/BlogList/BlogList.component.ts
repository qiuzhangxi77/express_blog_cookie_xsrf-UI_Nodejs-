/* eslint-disable @angular-eslint/component-selector */
import { Component, NgModule, OnInit } from '@angular/core';
import { UserService } from 'src/service/UserInformation';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogComponentModule } from './blog/blog/blog.component';


export interface BlogContent {
  id?: number,
  title: string,
  content: string
  creatTime?: number,
  author?: string,
  user?: string,
  userID: string,
  blogID?: string
}

@Component({
  selector: 'app-BlogList',
  templateUrl: './BlogList.component.html',
  styleUrls: ['./BlogList.component.css']
})
export class BlogListComponent implements OnInit {
  public blogArray: BlogContent[] = [];
  public isExpanded:boolean = true;
  public items = [1,2,3];
  public newTitle: string='';

  constructor(
    public userService: UserService,
    public accountApiService: AccountApiServiceService
  ) { }

  async ngOnInit() {
    try {
      const res =  await this.accountApiService.getBlogList();
      if(res.errno === 1) {
        console.log('get blogList failed');
        return ;
      }
      console.log('get blogList success');
      this.blogArray = res.data;
    } catch (error) {
      console.log('get blogList err');
    }
  }

  public toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    BlogComponentModule
  ],
  declarations: [BlogListComponent],
  exports: [BlogListComponent]
})
export class BlogListComponentModule { }
