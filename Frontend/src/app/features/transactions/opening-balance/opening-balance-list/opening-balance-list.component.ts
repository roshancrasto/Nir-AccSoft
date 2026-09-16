import { PermissionService } from '../../../../core/services/permission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OpeningBalanceService, OpeningBalance } from '../../../../core/services/opening-balance.service';
import { OpeningBalanceEntryComponent } from '../opening-balance-entry/opening-balance-entry.component';

@Component({
  selector: 'app-opening-balance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './opening-balance-list.component.html',
  styleUrls: ['./opening-balance-list.component.css']
})
export class OpeningBalanceListComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['financialYear', 'balanceType', 'bankAccount', 'openingAmount', 'remarks', 'actions'];
  dataSource: MatTableDataSource<OpeningBalance> = new MatTableDataSource<OpeningBalance>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: OpeningBalanceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loadData();

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
  loadData() {
    this.service.getAll().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error fetching opening balances', err);
        this.snackBar.open('Error loading data', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(OpeningBalanceEntryComponent, {
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event !== 'Cancel') {
        this.loadData();
      }
    });
  }

  deleteRow(row: OpeningBalance) {
    if (confirm('Are you sure you want to delete this opening balance?')) {
      this.service.delete(row.openingBalanceId).subscribe({
        next: () => {
          this.snackBar.open('Deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error deleting data', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
