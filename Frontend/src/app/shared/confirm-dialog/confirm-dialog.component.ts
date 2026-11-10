import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** danger = red (delete, deactivate); primary = amber */
  tone?: 'danger' | 'primary';
  icon?: string;
}

/** SmartPO-style confirmation popup. Closes with true (confirm) or false/undefined (cancel). */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="cfm" role="alertdialog" aria-modal="true" [attr.aria-label]="data.title">
      <span class="cfm-icon" [attr.data-tone]="tone">
        <mat-icon>{{ data.icon || (tone === 'danger' ? 'delete' : 'help') }}</mat-icon>
      </span>
      <div class="cfm-title">{{ data.title }}</div>
      <div class="cfm-text">{{ data.message }}</div>
    </div>
    <div class="cfm-foot">
      <button type="button" class="cfm-btn secondary" [mat-dialog-close]="false">{{ data.cancelText || 'Cancel' }}</button>
      <button type="button" class="cfm-btn" [class.danger]="tone === 'danger'" [class.primary]="tone !== 'danger'"
              [mat-dialog-close]="true">{{ data.confirmText || 'Delete' }}</button>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: 'Inter', sans-serif; }

    .cfm {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 22px 22px 6px;
      text-align: center;
    }

    .cfm-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      margin-bottom: 4px;
      border-radius: 50%;
      background: var(--accent-soft, #fff5df);
      color: var(--accent-ink, #8a5a00);
    }

    .cfm-icon[data-tone='danger'] {
      background: var(--danger-bg, #fef2f2);
      color: var(--danger, #dc2626);
    }

    .cfm-icon .mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: inherit;
    }

    .cfm-title {
      font-size: 16px;
      font-weight: 650;
      letter-spacing: -0.01em;
      color: var(--ink, #1c1c1e);
    }

    .cfm-text {
      font-size: 14px;
      line-height: 1.45;
      color: var(--ink-muted, #6e6e73);
    }

    .cfm-foot {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 18px 16px;
    }

    .cfm-btn {
      height: 34px;
      padding: 0 14px;
      border: 1px solid transparent;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color .15s ease, border-color .15s ease;
    }

    .cfm-btn:focus-visible {
      outline: 2px solid var(--accent, #ffb826);
      outline-offset: 1px;
    }

    .cfm-btn.secondary {
      flex: 1;
      background: #fff;
      border-color: var(--line, #e5e5ea);
      color: var(--ink-2, #3a3a3c);
    }

    .cfm-btn.secondary:hover { background: var(--canvas, #f5f5f7); border-color: var(--line-strong, #d1d1d6); }

    .cfm-btn.danger {
      flex: 1;
      background: var(--danger, #dc2626);
      color: #fff;
    }

    .cfm-btn.danger:hover { background: #b91c1c; }

    .cfm-btn.primary {
      flex: 1;
      background: var(--accent, #ffb826);
      color: var(--ink, #1c1c1e);
    }

    .cfm-btn.primary:hover { background: var(--accent-hover, #f5a913); }
  `]
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}

  get tone(): 'danger' | 'primary' {
    return this.data.tone || 'danger';
  }
}
