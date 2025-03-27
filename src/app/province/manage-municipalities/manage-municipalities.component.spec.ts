import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMunicipalitiesComponent } from './manage-municipalities.component';

describe('ManageMunicipalitiesComponent', () => {
  let component: ManageMunicipalitiesComponent;
  let fixture: ComponentFixture<ManageMunicipalitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageMunicipalitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMunicipalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
