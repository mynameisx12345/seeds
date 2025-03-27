import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceMenuComponent } from './province-menu.component';

describe('ProvinceMenuComponent', () => {
  let component: ProvinceMenuComponent;
  let fixture: ComponentFixture<ProvinceMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvinceMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
