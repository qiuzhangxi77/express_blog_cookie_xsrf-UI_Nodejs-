import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';
import { UserService } from 'src/service/UserInformation';
import { BlogComponentModule } from '../../BlogListContainer/BlogList/blog/blog/blog.component';
import { BlogContent } from '../../BlogListContainer/BlogList/BlogList.component';

@Component({
  selector: 'app-MyBlog',
  templateUrl: './MyBlog.component.html',
  styleUrls: ['./MyBlog.component.css']
})
export class MyBlogComponent implements OnInit {
  public myBlogArray: BlogContent[] = [];
  public addNewBlog: boolean = false;
  public newBlog: BlogContent = {
    title: 'new blog title',
    content: 'new blog content',
    userID: ''
  }

  constructor(
    public userService: UserService,
    public accountApiService: AccountApiServiceService,
  ) { }

  public ngOnInit() {
    this.updateMyBlogList();
  }

  public addingNewBlog() {
    this.addNewBlog = true;
  }

  public finishAddingNewBlog(bool: boolean) {
    this.addNewBlog = false;
    if(bool) {
      this.updateMyBlogList();
    }
  }

  public async updateMyBlogList() {
    try {
      const res =  await this.accountApiService.getMyBlogList(this.userService.userInformation.userID);
      if(res.errno === 1) {
        console.log("get myBlogList failed")
      }
      console.log("get myBlogList success")
      this.myBlogArray = res.data;
      const aa =2;
    } catch (error) {
      console.log("get myBlogList err")
    }
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
    BlogComponentModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [MyBlogComponent],
  exports: [MyBlogComponent]
})
export class MyBlogComponenttModule { }
