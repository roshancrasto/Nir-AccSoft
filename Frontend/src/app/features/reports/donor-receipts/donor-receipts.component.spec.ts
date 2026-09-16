import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorReceiptsComponent } from './donor-receipts.component';

describe('DonorReceiptsComponent', () => {
  let component: DonorReceiptsComponent;
  let fixture: ComponentFixture<DonorReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorReceiptsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DonorReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
