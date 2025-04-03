import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalityDistributionReportComponent } from './municipality-distribution-report.component';

describe('MunicipalityDistributionReportComponent', () => {
  let component: MunicipalityDistributionReportComponent;
  let fixture: ComponentFixture<MunicipalityDistributionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipalityDistributionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunicipalityDistributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
