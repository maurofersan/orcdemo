import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdTypeComponent } from './id-type.component';

describe('IdTypeComponent', () => {
  let component: IdTypeComponent;
  let fixture: ComponentFixture<IdTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
