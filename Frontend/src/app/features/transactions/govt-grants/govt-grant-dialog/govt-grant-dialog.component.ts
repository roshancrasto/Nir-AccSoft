import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventGroupService, EventGroup } from '../../../../core/services/event-group.service';
import { GovtGrant } from '../../../../core/services/govt-grant.service';

export interface GovtGrantDialogData {
  mode: 'add' | 'edit' | 'view';
  grant?: GovtGrant;
}

@Component({
  selector: 'app-govt-grant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './govt-grant-dialog.component.html',
  styleUrl: './govt-grant-dialog.component.css'
})
export class GovtGrantDialogComponent implements OnInit {
  form: FormGroup;
  eventGroups: EventGroup[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GovtGrantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GovtGrantDialogData,
    private eventGroupService: EventGroupService
  ) {
    this.form = this.fb.group({
      eventGroupKey: [null, Validators.required],
      grantDate: [new Date(), Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      considerForAudit: [true],
      remarks: ['']
    });

    if (this.data.grant) {
      this.form.patchValue({
        eventGroupKey: this.data.grant.eventGroupKey,
        grantDate: new Date(this.data.grant.grantDate),
        amount: this.data.grant.amount,
        considerForAudit: this.data.grant.considerForAudit,
        remarks: this.data.grant.remarks
      });
    }

    if (this.data.mode === 'view') {
      this.form.disable();
    }
  }

  ngOnInit(): void {
    this.loadEventGroups();
  }

  loadEventGroups(): void {
    this.eventGroupService.getEventGroups().subscribe({
      next: (groups: EventGroup[]) => {
        this.eventGroups = groups.filter(g => g.isActive);
      },
      error: (err) => {
        console.error('Failed to load event groups', err);
      }
    });
  }

  private formatDate(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSave(): void {
    if (this.form.invalid) return;

    const rawValue = this.form.getRawValue();
    const payload = {
      eventGroupKey: Number(rawValue.eventGroupKey),
      grantDate: this.formatDate(rawValue.grantDate),
      amount: Number(rawValue.amount),
      considerForAudit: !!rawValue.considerForAudit,
      remarks: rawValue.remarks || ''
    };

    this.dialogRef.close(payload);
  }
}
