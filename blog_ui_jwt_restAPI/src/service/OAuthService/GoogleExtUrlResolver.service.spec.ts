/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GoogleExtUrlResolverService } from './GoogleExtUrlResolver.service';

describe('Service: GoogleExtUrlResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleExtUrlResolverService]
    });
  });

  it('should ...', inject([GoogleExtUrlResolverService], (service: GoogleExtUrlResolverService) => {
    expect(service).toBeTruthy();
  }));
});
