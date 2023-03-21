/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExtUrlResolverServiceService } from './ExtUrlResolverService.service';

describe('Service: ExtUrlResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtUrlResolverServiceService]
    });
  });

  it('should ...', inject([ExtUrlResolverServiceService], (service: ExtUrlResolverServiceService) => {
    expect(service).toBeTruthy();
  }));
});
