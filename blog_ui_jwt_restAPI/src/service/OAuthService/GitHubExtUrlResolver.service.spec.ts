/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GitHubExtUrlResolverService } from './GitHubExtUrlResolver.service';

describe('Service: ExtUrlResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitHubExtUrlResolverService]
    });
  });

  it('should ...', inject([GitHubExtUrlResolverService], (service: GitHubExtUrlResolverService) => {
    expect(service).toBeTruthy();
  }));
});
