import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptRegisterComponent } from './receipt-register.component';

describe('ReceiptRegisterComponent', () => {
  let component: ReceiptRegisterComponent;
  let fixture: ComponentFixture<ReceiptRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiptRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
