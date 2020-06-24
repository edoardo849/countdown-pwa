import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownListComponent } from './countdown-list.component';

describe('CountdownListComponent', () => {
  let component: CountdownListComponent;
  let fixture: ComponentFixture<CountdownListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
