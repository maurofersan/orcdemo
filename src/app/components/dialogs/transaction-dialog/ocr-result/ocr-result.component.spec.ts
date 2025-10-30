import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrResultComponent } from './ocr-result.component';

describe('OcrResultComponent', () => {
  let component: OcrResultComponent;
  let fixture: ComponentFixture<OcrResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcrResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
