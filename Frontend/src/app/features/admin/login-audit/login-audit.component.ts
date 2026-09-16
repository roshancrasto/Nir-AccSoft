import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuditService, LoginAuditReport } from '../../../core/services/audit.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-audit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, 
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatCardModule,
    MatIconModule
  ],
  templateUrl: './login-audit.component.html',
  styleUrls: ['./login-audit.component.css']
})
export class LoginAuditComponent implements OnInit {
  filterForm: FormGroup;
  reports: LoginAuditReport[] = [];
  displayedColumns: string[] = ['userName', 'loginDateTime', 'logoutDateTime', 'durationMinutes', 'ipAddress', 'browserInfo'];

  constructor(private fb: FormBuilder, private auditService: AuditService) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.fetchReport();
  }

  fetchReport() {
    let { startDate, endDate } = this.filterForm.value;
    
    // Convert to ISO string if value is present
    const startStr = startDate ? new Date(startDate).toISOString() : undefined;
    const endStr = endDate ? new Date(endDate).toISOString() : undefined;

    this.auditService.getLoginAuditReport(startStr, endStr).subscribe(data => {
      this.reports = data;
    });
  }
}
