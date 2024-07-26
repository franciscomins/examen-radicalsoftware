import { TestBed } from '@angular/core/testing';

import { BanxicoService } from './banxico.service';

describe('BanxicoService', () => {
  let service: BanxicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanxicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
