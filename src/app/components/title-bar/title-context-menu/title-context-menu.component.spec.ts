import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TitleContextMenuComponent } from './title-context-menu.component';

describe('TitleContextMenuComponent', () => {
  let component: TitleContextMenuComponent;
  let fixture: ComponentFixture<TitleContextMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
