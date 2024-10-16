import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalleAmangeDetailsComponent } from './salle-amange-details.component';

describe('SalleAmangeDetailsComponent', () => {
  let component: SalleAmangeDetailsComponent;
  let fixture: ComponentFixture<SalleAmangeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalleAmangeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalleAmangeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
