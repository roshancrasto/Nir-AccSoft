import { PermissionService } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { PaymentExpenseLinkService, PaymentExpenseLink } from '../../../core/services/payment-expense-link.service';
import { ReimbursementDialogComponent } from '../reimbursement-dialog/reimbursement-dialog.component';

@Component({
  selector: 'app-reimbursements',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule, MatPaginatorModule],
  templateUrl: './reimbursements.component.html',
  styleUrls: ['./reimbursements.component.css']
})
export class ReimbursementsComponent implements OnInit {
  canAdd = false;
  canEdit = false;
  canDelete = false;

  displayedColumns: string[] = ['memberName', 'eventGroupName', 'categoryName', 'expenseDetails', 'amount', 'isSettled', 'actions'];
  dataSource = new MatTableDataSource<PaymentExpenseLink>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: PaymentExpenseLinkService,
    private dialog: MatDialog,
    private permissionService: PermissionService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();

    const user = this.authService.getCurrentUser();
    if (user?.roleId === 1) {
      this.canAdd = this.canEdit = this.canDelete = true;
    } else {
      this.permissionService.myPermissions$.subscribe(perms => {
        const routePerm = perms.find(p => p.menuRoute === '/transactions/reimbursements');
        if (routePerm) {
          this.canAdd = routePerm.canAdd;
          this.canEdit = routePerm.canEdit;
          this.canDelete = routePerm.canDelete;
        }
      });
    }
  }

  loadData(): void {
    this.service.getAll().subscribe((data: PaymentExpenseLink[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(element?: PaymentExpenseLink): void {
    const dialogRef = this.dialog.open(ReimbursementDialogComponent, {
      width: '600px',
      data: { mode: element ? 'edit' : 'add', link: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.expenseId) {
          this.service.update(result.expenseId, result).subscribe(() => this.loadData());
        } else {
          this.service.create(result).subscribe(() => this.loadData());
        }
      }
    });
  }

  deleteLink(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }
}
