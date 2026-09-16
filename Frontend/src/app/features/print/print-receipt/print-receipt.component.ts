import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-print-receipt',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.css']
})
export class PrintReceiptComponent implements OnInit {

  receipt: any = {
    receiptNumber: 'REC-0001',
    receiptDate: new Date(),
    donorName: 'Sample Donor',
    eventName: 'Annual Fundraiser 2025',
    paymentMode: 'Cash',
    cashAmount: 5000,
    bankAmount: 0,
    referenceNumber: '',
    panAvailable: true
  };

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    // In production, fetch receipt details from route params or a service
  }

  printReceipt(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }
}
