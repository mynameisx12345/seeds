import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderWholeComponent } from './loader-whole.component';

describe('LoaderWholeComponent', () => {
  let component: LoaderWholeComponent;
  let fixture: ComponentFixture<LoaderWholeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderWholeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderWholeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
