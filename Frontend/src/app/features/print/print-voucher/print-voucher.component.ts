import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-print-voucher',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './print-voucher.component.html',
  styleUrls: ['./print-voucher.component.css']
})
export class PrintVoucherComponent implements OnInit {

  voucher: any = {
    voucherNumber: 'PV-0001',
    voucherDate: new Date(),
    paymentDate: new Date(),
    vendorName: 'Sample Vendor Services',
    eventName: 'Annual Fundraiser 2025',
    categoryName: 'Venue & Decoration',
    paymentMode: 'Bank Transfer',
    debitAmount: 12000,
    description: 'Stage decoration and lighting services for fundraiser event',
    billAvailable: true,
    billNumber: 'INV-2025-0456',
    billDate: new Date()
  };

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    // In production, fetch voucher details from route params or a service
  }

  printVoucher(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }
}
