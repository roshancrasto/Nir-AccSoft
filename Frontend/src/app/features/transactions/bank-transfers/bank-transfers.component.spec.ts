import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransfersComponent } from './bank-transfers.component';

describe('BankTransfersComponent', () => {
  let component: BankTransfersComponent;
  let fixture: ComponentFixture<BankTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankTransfersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
