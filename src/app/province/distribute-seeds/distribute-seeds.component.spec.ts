import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeSeedsComponent } from './distribute-seeds.component';

describe('DistributeSeedsComponent', () => {
  let component: DistributeSeedsComponent;
  let fixture: ComponentFixture<DistributeSeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributeSeedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributeSeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
