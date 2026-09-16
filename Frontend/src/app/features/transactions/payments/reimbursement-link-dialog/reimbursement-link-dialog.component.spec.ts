import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementLinkDialogComponent } from './reimbursement-link-dialog.component';

describe('ReimbursementLinkDialogComponent', () => {
  let component: ReimbursementLinkDialogComponent;
  let fixture: ComponentFixture<ReimbursementLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementLinkDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReimbursementLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
