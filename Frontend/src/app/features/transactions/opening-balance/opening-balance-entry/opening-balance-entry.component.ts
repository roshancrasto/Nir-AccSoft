import { PermissionService } from '../../../../core/services/permission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OpeningBalanceService, BankAccountDropdown } from '../../../../core/services/opening-balance.service';

@Component({
  selector: 'app-opening-balance-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './opening-balance-entry.component.html',
  styleUrls: ['./opening-balance-entry.component.css']
})
export class OpeningBalanceEntryComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  action: string;
  localData: any;
  entryForm!: FormGroup;
  bankAccounts: BankAccountDropdown[] = [];
  balanceTypes: string[] = ['Cash', 'Bank'];
  financialYears: string[] = ['2023-24', '2024-25', '2025-26', '2026-27', '2027-28'];

  constructor(
    private fb: FormBuilder,
    private service: OpeningBalanceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<OpeningBalanceEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionService: PermissionService,
    private authService: AuthService
  ) {
    this.localData = { ...data };
    this.action = this.localData.action;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadBankAccounts();

    if (this.action === 'Update' || this.action === 'View') {
      this.entryForm.patchValue(this.localData);
      if (this.action === 'View') {
        this.entryForm.disable();
      }
  
    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/opening-balances');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }
  }

  initForm() {
    this.entryForm = this.fb.group({
      openingBalanceId: [0],
      financialYear: ['', Validators.required],
      balanceType: ['', Validators.required],
      bankAccountId: [null],
      openingAmount: [0, [Validators.required, Validators.min(0.01)]],
      remarks: ['']
    });

    this.entryForm.get('balanceType')?.valueChanges.subscribe(type => {
      const bankCtrl = this.entryForm.get('bankAccountId');
      if (type === 'Bank') {
        bankCtrl?.setValidators([Validators.required]);
      } else {
        bankCtrl?.clearValidators();
        bankCtrl?.setValue(null);
      }
      bankCtrl?.updateValueAndValidity();
    });
  }

  loadBankAccounts() {
    this.service.getBankAccounts().subscribe({
      next: (res) => {
        this.bankAccounts = res;
      },
      error: (err) => {
        console.error('Failed to load bank accounts', err);
      }
    });
  }

  onSubmit() {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      return;
    }

    const formData = this.entryForm.value;

    if (this.action === 'Add') {
      this.service.create(formData).subscribe({
        next: () => {
          this.snackBar.open('Opening Balance Added successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close({ event: this.action, data: formData });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(err.error?.Message || 'Failed to add Opening Balance', 'Close', { duration: 5000 });
        }
      });
    } else if (this.action === 'Update') {
      this.service.update(formData.openingBalanceId, formData).subscribe({
        next: () => {
          this.snackBar.open('Opening Balance Updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close({ event: this.action, data: formData });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(err.error?.Message || 'Failed to update Opening Balance', 'Close', { duration: 5000 });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  get f() { return this.entryForm.controls; }
}
