import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackDetailsComponent } from './pack-details.component';

describe('PackDetailsComponent', () => {
  let component: PackDetailsComponent;
  let fixture: ComponentFixture<PackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
