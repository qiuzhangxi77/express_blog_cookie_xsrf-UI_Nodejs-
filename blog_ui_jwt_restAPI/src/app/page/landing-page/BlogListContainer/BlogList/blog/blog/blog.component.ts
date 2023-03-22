import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { BlogContent } from '../../BlogList.component';
import { UserService } from 'src/service/UserInformation';
import { AccountApiServiceService } from 'src/service/AccountApiService.service';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
    public isExpanded: boolean = true;
    public isEdit: boolean = false;
    public originBlog!: BlogContent;
    @Input() blogData!: BlogContent;
    @Input() readOnly: boolean = true;
    @Input() addNewBlog: boolean = false;
    @Output() public handleAddNewBlog = new EventEmitter<boolean>();
    @Output() public handleDeleteNewBlog = new EventEmitter();

    constructor(private _userService: UserService, public accountApiService: AccountApiServiceService) {}

    public ngOnInit() {
        this.originBlog = JSON.parse(JSON.stringify(this.blogData));
    }

    public toggleExpanded() {
        this.isExpanded = !this.isExpanded;
    }

    public editMode() {
        if (!this.isEdit) {
            this.isEdit = true;
        }
    }

    public cancelEdit() {
        if (this.isEdit) {
            this.isEdit = false;
            this.blogData = this.originBlog;
        }
    }

    public async update() {
        try {
            const res = await this.accountApiService.updateBlog(this.blogData);
            if (res.errno === 1) {
                console.log('update title failed');
            }
            console.log('update title success');
            const blogList = await this.getMyBlogList();
            blogList.forEach((data: BlogContent) => {
                if (this.blogData.blogID === data.blogID) {
                    this.blogData = data;
                }
            });
            this.originBlog = JSON.parse(JSON.stringify(this.blogData));
            this.isEdit = false;
        } catch (error) {
            console.log('update title err');
        }
    }

    public async getMyBlogList() {
        const id = this.blogData.id;
        try {
            const res = await this.accountApiService.getMyBlogList(this._userService.userInformation.userID);
            if (res.errno === 1) {
                console.log('get myBlogList failed');
            }
            console.log('get myBlogList success');
            return res.data;
        } catch (error) {
            console.log('get myBlog err');
        }
    }

    public async createNewBlog() {
        try {
            if (this.addNewBlog) {
                this.blogData.userID = this._userService.userInformation.userID;
                this.blogData.author = this._userService.userInformation.realname;
                this.blogData.user = this._userService.userInformation.username;
            }
            const res = await this.accountApiService.newBlog(this.blogData);
            if (res.errno === 1) {
                console.log('create newBlog failed');
            }
            console.log('create newBlog success');
        } catch (error) {
            console.log('create new blog err');
        }
        this.handleAddNewBlog.emit(true);
    }

    public async delete() {
        try {
            const res = await this.accountApiService.deleteBlog(this.blogData);
            if (res.errno === 1) {
                console.log('delete blog failed');
            }
            console.log('delete blog success');
            this.handleDeleteNewBlog.emit();
        } catch (error) {
            console.log('delete blog err');
        }
    }

    public cancelAddNewBlog() {
        this.handleAddNewBlog.emit(false);
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
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
    ],
    declarations: [BlogComponent],
    exports: [BlogComponent],
})
export class BlogComponentModule {}
