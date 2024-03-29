/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyBlogComponent } from './MyBlog.component';

describe('MyBlogComponent', () => {
    let component: MyBlogComponent;
    let fixture: ComponentFixture<MyBlogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyBlogComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyBlogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
