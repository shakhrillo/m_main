import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsFilterFormComponent } from './directions-filter-form.component';

describe('DirectionsFilterFormComponent', () => {
  let component: DirectionsFilterFormComponent;
  let fixture: ComponentFixture<DirectionsFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectionsFilterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionsFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
