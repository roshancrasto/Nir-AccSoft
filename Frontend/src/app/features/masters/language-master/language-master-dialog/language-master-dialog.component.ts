import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface LanguageMasterDialogData {
  mode: 'add' | 'edit';
  language?: {
    langKey: number;
    langName: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-language-master-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './language-master-dialog.component.html',
  styleUrl: './language-master-dialog.component.css'
})
export class LanguageMasterDialogComponent {
  langName: string = '';
  isActive: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<LanguageMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LanguageMasterDialogData
  ) {
    if (data.mode === 'edit' && data.language) {
      this.langName = data.language.langName;
      this.isActive = data.language.isActive;
    }
  }

  onSave(): void {
    if (!this.langName?.trim()) return;

    const languageData = {
      langName: this.langName.trim(),
      isActive: this.isActive
    };

    if (this.data.mode === 'edit') {
      this.dialogRef.close({
        langKey: this.data.language!.langKey,
        ...languageData
      });
    } else {
      this.dialogRef.close(languageData);
    }
  }
}
