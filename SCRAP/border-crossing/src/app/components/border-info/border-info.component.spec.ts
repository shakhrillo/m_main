import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderInfoComponent } from './border-info.component';

describe('BorderInfoComponent', () => {
  let component: BorderInfoComponent;
  let fixture: ComponentFixture<BorderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorderInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
