import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceDistributionReportComponent } from './province-distribution-report.component';

describe('ProvinceDistributionReportComponent', () => {
  let component: ProvinceDistributionReportComponent;
  let fixture: ComponentFixture<ProvinceDistributionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinceDistributionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceDistributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
