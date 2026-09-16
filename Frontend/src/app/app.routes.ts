import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PermissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'user-permissions',
        loadComponent: () => import('./features/admin/user-permissions/user-permissions.component').then(m => m.UserPermissionsComponent)
      },
      {
        path: 'login-audit',
        loadComponent: () => import('./features/admin/login-audit/login-audit.component').then(m => m.LoginAuditComponent)
      }
    ]
  },
  {
    path: 'masters',
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'categories',
        loadComponent: () => import('./features/masters/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'donors',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/masters/donors/donors.component').then(m => m.DonorsComponent)
          },
          {
            path: 'add',
            redirectTo: '',
            pathMatch: 'full'
          },
          {
            path: ':id',
            redirectTo: '',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'event-groups',
        loadComponent: () => import('./features/masters/event-groups/event-groups.component').then(m => m.EventGroupsComponent)
      },
      {
        path: 'languages',
        loadComponent: () => import('./features/masters/language-master/language-master.component').then(m => m.LanguageMasterComponent)
      },
      {
        path: 'event-categories',
        loadComponent: () => import('./features/masters/event-categories/event-categories.component').then(m => m.EventCategoriesComponent)
      },
      {
        path: 'event-details',
        loadComponent: () => import('./features/masters/event-details/event-details.component').then(m => m.EventDetailsComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./features/masters/vendors/vendors.component').then(m => m.VendorsComponent)
      }
    ]
  },
  {
    path: 'transactions',
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'receipts',
        loadComponent: () => import('./features/transactions/receipts/receipts.component').then(m => m.ReceiptsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/transactions/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'reimbursements',
        loadComponent: () => import('./features/transactions/reimbursements/reimbursements.component').then(m => m.ReimbursementsComponent)
      },
      {
        path: 'assets',
        loadComponent: () => import('./features/transactions/assets/assets.component').then(m => m.AssetsComponent)
      },
      {
        path: 'bank-transfers',
        loadComponent: () => import('./features/transactions/bank-transfers/bank-transfers.component').then(m => m.BankTransfersComponent)
      },
      {
        path: 'box-collections',
        loadComponent: () => import('./features/transactions/box-collections/box-collections.component').then(m => m.BoxCollectionsComponent)
      },
      {
        path: 'govt-grants',
        loadComponent: () => import('./features/transactions/govt-grants/govt-grants.component').then(m => m.GovtGrantsComponent)
      },
      {
        path: 'opening-balances',
        loadComponent: () => import('./features/transactions/opening-balance/opening-balance-list/opening-balance-list.component').then(m => m.OpeningBalanceListComponent)
      }
    ]
  },
  {
    path: 'internal',
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'accounts',
        loadComponent: () => import('./features/internal-accounts/event-group-summary/event-group-summary.component').then(m => m.EventGroupSummaryComponent)
      },
      {
        path: 'accounts/:id',
        loadComponent: () => import('./features/internal-accounts/event-expense-details/event-expense-details.component').then(m => m.EventExpenseDetailsComponent)
      }
    ]
  },
  {
    path: 'reports',
    canActivate: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'receipt-register',
        loadComponent: () => import('./features/reports/receipt-register/receipt-register.component').then(m => m.ReceiptRegisterComponent)
      },
      {
        path: 'payment-register',
        loadComponent: () => import('./features/reports/payment-register/payment-register.component').then(m => m.PaymentRegisterComponent)
      },
      {
        path: 'category-expense',
        loadComponent: () => import('./features/reports/category-expense/category-expense.component').then(m => m.CategoryExpenseComponent)
      },
      {
        path: 'event-group-pnl',
        loadComponent: () => import('./features/reports/event-group-pnl/event-group-pnl.component').then(m => m.EventGroupPnlComponent)
      },
      {
        path: 'donor-receipts',
        loadComponent: () => import('./features/reports/donor-receipts/donor-receipts.component').then(m => m.DonorReceiptsComponent)
      },
      {
        path: 'income-expenditure',
        loadComponent: () => import('./features/reports/income-expenditure/income-expenditure.component').then(m => m.IncomeExpenditureComponent)
      },
      {
        path: 'event-expenses',
        loadComponent: () => import('./features/reports/event-expenses/event-expenses.component').then(m => m.EventExpensesComponent)
      },
      {
        path: 'receipts-payments',
        loadComponent: () => import('./features/reports/receipts-payments/receipts-payments.component').then(m => m.ReceiptsPaymentsComponent)
      },
      {
        path: 'account-ledger',
        loadComponent: () => import('./features/reports/account-ledger/account-ledger.component').then(m => m.AccountLedgerComponent)
      },
      {
        path: 'vouchers',
        loadComponent: () => import('./features/reports/vouchers/vouchers.component').then(m => m.VouchersComponent)
      }
    ]
  },
  {
    path: 'print',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'receipt/:id',
        loadComponent: () => import('./features/print/print-receipt/print-receipt.component').then(m => m.PrintReceiptComponent)
      },
      {
        path: 'voucher/:id',
        loadComponent: () => import('./features/print/print-voucher/print-voucher.component').then(m => m.PrintVoucherComponent)
      }
    ]
  }
];
