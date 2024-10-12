import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalleAMangeManagementComponent } from './salle-amange-management.component';

describe('SalleAMangeManagementComponent', () => {
  let component: SalleAMangeManagementComponent;
  let fixture: ComponentFixture<SalleAMangeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalleAMangeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalleAMangeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
