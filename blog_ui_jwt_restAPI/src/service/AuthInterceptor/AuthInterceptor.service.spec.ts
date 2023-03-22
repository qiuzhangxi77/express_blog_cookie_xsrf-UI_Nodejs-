/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthInterceptor } from './AuthInterceptor.service';

describe('Service: AuthInterceptor', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthInterceptor],
        });
    });

    it('should ...', inject([AuthInterceptor], (service: AuthInterceptor) => {
        expect(service).toBeTruthy();
    }));
});
