import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportexcelComponent } from './importexcel.component';

describe('ImportexcelComponent', () => {
  let component: ImportexcelComponent;
  let fixture: ComponentFixture<ImportexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportexcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
