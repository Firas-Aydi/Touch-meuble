import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackManagementComponent } from './pack-management.component';

describe('PackManagementComponent', () => {
  let component: PackManagementComponent;
  let fixture: ComponentFixture<PackManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
