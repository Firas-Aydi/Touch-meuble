import { TestBed } from '@angular/core/testing';

import { SalleAMangeService } from './salle-amange.service';

describe('SalleAMangeService', () => {
  let service: SalleAMangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalleAMangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
