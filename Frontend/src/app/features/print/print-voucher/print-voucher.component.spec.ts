import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintVoucherComponent } from './print-voucher.component';

describe('PrintVoucherComponent', () => {
  let component: PrintVoucherComponent;
  let fixture: ComponentFixture<PrintVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintVoucherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
