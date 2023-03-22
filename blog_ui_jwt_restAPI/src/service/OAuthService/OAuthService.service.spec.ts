/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OAuthServiceService } from './OAuthService.service';

describe('Service: OAuthService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [OAuthServiceService],
        });
    });

    it('should ...', inject([OAuthServiceService], (service: OAuthServiceService) => {
        expect(service).toBeTruthy();
    }));
});
