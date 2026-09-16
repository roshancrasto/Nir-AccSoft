import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface DonorDialogData {
  mode: 'add' | 'edit';
  donor?: {
    donorId: number;
    donorName: string;
    mobileNumber: string;
    dPlace: string;
    dAddr1: string;
    dAddr2: string;
    dAddr3: string;
    dCity: string;
    dState: string;
    isUdyavarParish: boolean;
    panNumber: string;
    email: string;
    remarks: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-donor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="dialog-icon">{{ data.mode === 'add' ? 'person_add' : 'person' }}</mat-icon>
      {{ data.mode === 'add' ? 'Add New Donor' : 'Edit Donor' }}
    </h2>
    <mat-dialog-content>
      <form [formGroup]="donorForm" class="donor-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Donor Name</mat-label>
            <input matInput formControlName="donorName" required placeholder="Enter full name">
            <mat-error *ngIf="donorForm.get('donorName')?.hasError('required')">Donor name is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Mobile Number</mat-label>
            <input matInput formControlName="mobileNumber" placeholder="e.g. 9876543210">
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>PAN Number</mat-label>
            <input matInput formControlName="panNumber" placeholder="e.g. ABCDE1234F">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email Address</mat-label>
            <input matInput formControlName="email" type="email" placeholder="e.g. donor@example.com">
          </mat-form-field>
        </div>

        <div class="section-title">Address Details</div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Place</mat-label>
            <input matInput formControlName="dPlace" placeholder="Enter place">
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>City</mat-label>
            <input matInput formControlName="dCity" placeholder="Enter city">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>State</mat-label>
            <input matInput formControlName="dState" placeholder="Enter state">
          </mat-form-field>

          <div class="half-width parish-toggle">
            <mat-checkbox formControlName="isUdyavarParish" color="primary">
              Udyavar Parish Member
            </mat-checkbox>
          </div>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address Line 1</mat-label>
            <input matInput formControlName="dAddr1" placeholder="House No, Building Name">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address Line 2</mat-label>
            <input matInput formControlName="dAddr2" placeholder="Street, Area">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Address Line 3</mat-label>
            <input matInput formControlName="dAddr3" placeholder="Landmark">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Remarks</mat-label>
            <textarea matInput formControlName="remarks" rows="2" placeholder="Any additional notes"></textarea>
          </mat-form-field>
        </div>

        <div class="toggle-row" *ngIf="data.mode === 'edit'">
          <mat-slide-toggle formControlName="isActive" color="primary">
            {{ donorForm.get('isActive')?.value ? 'Active' : 'Inactive' }}
          </mat-slide-toggle>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="donorForm.invalid" (click)="onSave()">
        <mat-icon>save</mat-icon>
        {{ data.mode === 'add' ? 'Add' : 'Update' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .donor-form {
      padding-top: 10px;
      min-width: 450px;
    }
    .full-width {
      width: 100%;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }
    .half-width {
      flex: 1;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a237e;
      margin: 16px 0 8px 0;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 4px;
    }
    .parish-toggle {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .dialog-icon {
      vertical-align: middle;
      margin-right: 8px;
    }
    .toggle-row {
      margin-top: 16px;
      margin-bottom: 8px;
    }
  `]
})
export class DonorDialogComponent {
  donorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DonorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DonorDialogData
  ) {
    this.donorForm = this.fb.group({
      donorName: ['', Validators.required],
      mobileNumber: [''],
      dPlace: [''],
      dAddr1: [''],
      dAddr2: [''],
      dAddr3: [''],
      dCity: [''],
      dState: [''],
      isUdyavarParish: [false],
      panNumber: [''],
      email: ['', Validators.email],
      remarks: [''],
      isActive: [true]
    });

    if (data.mode === 'edit' && data.donor) {
      this.donorForm.patchValue(data.donor);
    }
  }

  onSave(): void {
    if (this.donorForm.invalid) return;

    const donorData = this.donorForm.value;

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        donorId: this.data.donor!.donorId,
        ...donorData
      });
    } else {
      this.dialogRef.close(donorData);
    }
  }
}
