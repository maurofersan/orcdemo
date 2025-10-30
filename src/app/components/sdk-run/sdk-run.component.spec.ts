import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SdkRunComponent } from './sdk-run.component';

describe('SdkRunComponent', () => {
  let component: SdkRunComponent;
  let fixture: ComponentFixture<SdkRunComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
