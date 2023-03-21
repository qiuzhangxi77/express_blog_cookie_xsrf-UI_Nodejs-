/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IsAuthenticatedService } from './is-authenticated.service';

describe('Service: IsAuthenticated', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAuthenticatedService]
    });
  });

  it('should ...', inject([IsAuthenticatedService], (service: IsAuthenticatedService) => {
    expect(service).toBeTruthy();
  }));
});
