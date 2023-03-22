/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { GitHubRedirectComponent } from './GitHubRedirect.component';

describe('GitHubRedirectComponent', () => {
    let component: GitHubRedirectComponent;
    let fixture: ComponentFixture<GitHubRedirectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GitHubRedirectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GitHubRedirectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
