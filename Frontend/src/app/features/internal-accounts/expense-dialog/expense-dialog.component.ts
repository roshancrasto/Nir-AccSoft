import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InternalAccountService, EventExpense } from '../../../core/services/internal-account.service';

@Component({
  selector: 'app-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.css']
})
export class ExpenseDialogComponent implements OnInit {
  expenseForm: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private internalAccountService: InternalAccountService,
    public dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { expense: EventExpense | null, eventGroupKey: number }
  ) {
    this.expenseForm = this.fb.group({
      eventGroupKey: [data.eventGroupKey, Validators.required],
      expenseCode: [''],
      expenseDetails: [''],
      expenseDesc: [''],
      paymentMode: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    if (this.data.expense) {
      this.isEdit = true;
      this.expenseForm.patchValue(this.data.expense);
    }
  }

  onSave(): void {
    if (this.expenseForm.valid) {
      const payload = this.expenseForm.value;
      
      if (this.isEdit && this.data.expense) {
        this.internalAccountService.updateExpense(this.data.expense.eventExpenseKey, payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error updating expense', err)
        });
      } else {
        this.internalAccountService.createExpense(payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error creating expense', err)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
