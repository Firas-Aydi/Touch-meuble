import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalleAmangeComponent } from './salle-amange.component';

describe('SalleAmangeComponent', () => {
  let component: SalleAmangeComponent;
  let fixture: ComponentFixture<SalleAmangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalleAmangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalleAmangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
