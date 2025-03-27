import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalityMenuComponent } from './municipality-menu.component';

describe('MunicipalityMenuComponent', () => {
  let component: MunicipalityMenuComponent;
  let fixture: ComponentFixture<MunicipalityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MunicipalityMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunicipalityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
