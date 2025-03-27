import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSeedsComponent } from './manage-seeds.component';

describe('ManageSeedsComponent', () => {
  let component: ManageSeedsComponent;
  let fixture: ComponentFixture<ManageSeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageSeedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
