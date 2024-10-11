import { TestBed } from '@angular/core/testing';

import { SalonService } from './salon.service';

describe('SalonService', () => {
  let service: SalonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
