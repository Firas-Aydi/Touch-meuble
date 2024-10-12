import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreManagementComponent } from './chambre-management.component';

describe('ChambreManagementComponent', () => {
  let component: ChambreManagementComponent;
  let fixture: ComponentFixture<ChambreManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambreManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChambreManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
