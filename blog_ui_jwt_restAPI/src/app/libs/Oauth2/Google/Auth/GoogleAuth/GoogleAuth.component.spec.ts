/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GoogleAuthComponent } from './GoogleAuth.component';

describe('GoogleAuthComponent', () => {
    let component: GoogleAuthComponent;
    let fixture: ComponentFixture<GoogleAuthComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GoogleAuthComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GoogleAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
