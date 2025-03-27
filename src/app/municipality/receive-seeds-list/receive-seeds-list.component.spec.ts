import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveSeedsListComponent } from './receive-seeds-list.component';

describe('ReceiveSeedsListComponent', () => {
  let component: ReceiveSeedsListComponent;
  let fixture: ComponentFixture<ReceiveSeedsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiveSeedsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveSeedsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
