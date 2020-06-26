import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownItemComponent } from './countdown-item.component';

describe('CountdownItemComponent', () => {
  let component: CountdownItemComponent;
  let fixture: ComponentFixture<CountdownItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
