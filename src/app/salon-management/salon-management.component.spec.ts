import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonManagementComponent } from './salon-management.component';

describe('SalonManagementComponent', () => {
  let component: SalonManagementComponent;
  let fixture: ComponentFixture<SalonManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
