import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardSummary, RecentActivity } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  isLoading = true;

  quickLinks = [
    { title: 'Receipt Entry', icon: 'receipt_long', route: '/transactions/receipts', color: '#4caf50', desc: 'Record incoming donations and fees' },
    { title: 'Payment Voucher', icon: 'payment', route: '/transactions/payments', color: '#f44336', desc: 'Process vendor and expense payments' },
    { title: 'View Reports', icon: 'analytics', route: '/reports/income-expenditure', color: '#2196f3', desc: 'Analyze income vs expenditure' },
    { title: 'Manage Event Groups', icon: 'event', route: '/masters/event-groups', color: '#ff9800', desc: 'Create and update upcoming event groups' }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard summary:', err);
        this.isLoading = false;
      }
    });
  }
}
