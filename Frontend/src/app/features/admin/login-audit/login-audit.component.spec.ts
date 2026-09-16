import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuditComponent } from './login-audit.component';

describe('LoginAuditComponent', () => {
  let component: LoginAuditComponent;
  let fixture: ComponentFixture<LoginAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
