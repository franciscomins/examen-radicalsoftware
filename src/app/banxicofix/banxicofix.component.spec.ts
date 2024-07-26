import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanxicofixComponent } from './banxicofix.component';

describe('BanxicofixComponent', () => {
  let component: BanxicofixComponent;
  let fixture: ComponentFixture<BanxicofixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanxicofixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanxicofixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
