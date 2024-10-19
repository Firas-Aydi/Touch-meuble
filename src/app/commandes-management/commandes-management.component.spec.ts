import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesManagementComponent } from './commandes-management.component';

describe('CommandesManagementComponent', () => {
  let component: CommandesManagementComponent;
  let fixture: ComponentFixture<CommandesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
