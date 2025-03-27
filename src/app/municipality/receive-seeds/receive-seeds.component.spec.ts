import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveSeedsComponent } from './receive-seeds.component';

describe('ReceiveSeedsComponent', () => {
  let component: ReceiveSeedsComponent;
  let fixture: ComponentFixture<ReceiveSeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiveSeedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveSeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
