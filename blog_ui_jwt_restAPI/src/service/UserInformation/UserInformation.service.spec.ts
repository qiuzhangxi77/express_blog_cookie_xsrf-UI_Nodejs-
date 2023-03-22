/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserInformationService } from './UserInformation.service';

describe('Service: UserInformation', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserInformationService],
        });
    });

    it('should ...', inject([UserInformationService], (service: UserInformationService) => {
        expect(service).toBeTruthy();
    }));
});
