import { TestBed } from '@angular/core/testing';

import { PwaService } from './pwa.service';

describe('UpdateService', () => {
  let service: PwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
