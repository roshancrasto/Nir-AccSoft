import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';

/** Replaces window.confirm() with the app's styled confirmation popup. Emits true only when confirmed. */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '380px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: 'first-tabbable', // Cancel gets focus, so Enter never deletes by accident
      panelClass: 'confirm-dialog-panel'
    }).afterClosed().pipe(map(result => result === true));
  }
}
