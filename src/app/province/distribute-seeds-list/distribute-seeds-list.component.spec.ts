import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeSeedsListComponent } from './distribute-seeds-list.component';

describe('DistributeSeedsListComponent', () => {
  let component: DistributeSeedsListComponent;
  let fixture: ComponentFixture<DistributeSeedsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributeSeedsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributeSeedsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
