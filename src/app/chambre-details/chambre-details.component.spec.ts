import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreDetailsComponent } from './chambre-details.component';

describe('ChambreDetailsComponent', () => {
  let component: ChambreDetailsComponent;
  let fixture: ComponentFixture<ChambreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambreDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChambreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
