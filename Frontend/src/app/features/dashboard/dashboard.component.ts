import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DASHBOARD_SAMPLE, DashboardData, MonthFlow } from './dashboard.mock';

interface Tooltip {
  host: string;
  flip: boolean;
  x: number;
  y: number;
  title: string;
  rows: { label: string; value: string; swatch?: string }[];
}

interface MonthBar {
  m: MonthFlow;
  x: number;           // left edge of the month band
  band: number;        // band width
  receiptsPath: string;
  paymentsPath: string;
  labelX: number;
}

/** Chart geometry (SVG user units). */
const CH = { w: 640, h: 230, padL: 52, padR: 8, padT: 12, padB: 28, barW: 14, barGap: 2 };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  /** Sample data until the dashboard is connected to the API. */
  readonly isSample = true;
  data: DashboardData = DASHBOARD_SAMPLE;

  userName = '';
  greeting = '';
  today = new Date();

  // Totals
  totalReceipts = 0;
  totalPayments = 0;
  surplus = 0;
  totalBalance = 0;
  cashBalance = 0;
  receiptsChange = 0;
  paymentsChange = 0;

  // Monthly chart
  readonly ch = CH;
  monthBars: MonthBar[] = [];
  yTicks: { y: number; label: string }[] = [];
  showMonthTable = false;
  hoverMonth: string | null = null;

  // Sparklines (receipts / payments)
  receiptsSpark = '';
  paymentsSpark = '';

  // Event groups (diverging), categories, accounts
  groupRows: { name: string; net: number; income: number; expense: number; left: number; width: number }[] = [];
  groupZero = 0;
  categoryRows: { name: string; amount: number; pct: number; share: number }[] = [];
  accountRows: { name: string; type: string; balance: number; pct: number; share: number }[] = [];

  tip: Tooltip | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = (user?.fullName || '').split(' ')[0] || 'there';
    const h = this.today.getHours();
    this.greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    this.build(this.data);
  }

  private build(d: DashboardData): void {
    this.totalReceipts = d.months.reduce((s, m) => s + m.receipts, 0);
    this.totalPayments = d.months.reduce((s, m) => s + m.payments, 0);
    this.surplus = this.totalReceipts - this.totalPayments;
    this.totalBalance = d.accounts.reduce((s, a) => s + a.balance, 0);
    this.cashBalance = d.accounts.filter(a => a.type === 'Cash').reduce((s, a) => s + a.balance, 0);
    this.receiptsChange = this.pctChange(this.totalReceipts, d.lastYear.receipts);
    this.paymentsChange = this.pctChange(this.totalPayments, d.lastYear.payments);

    this.buildMonthChart(d.months);
    this.receiptsSpark = this.sparkPath(d.months.map(m => m.receipts));
    this.paymentsSpark = this.sparkPath(d.months.map(m => m.payments));

    // Event groups: net result, sorted best to worst, bars diverge from zero
    const groups = d.eventGroups.map(g => ({ ...g, net: g.income - g.expense })).sort((a, b) => b.net - a.net);
    const maxPos = Math.max(0, ...groups.map(g => g.net));
    const maxNeg = Math.max(0, ...groups.map(g => -g.net));
    const span = maxPos + maxNeg || 1;
    this.groupZero = (maxNeg / span) * 100;
    this.groupRows = groups.map(g => {
      const w = (Math.abs(g.net) / span) * 100;
      return { name: g.name, net: g.net, income: g.income, expense: g.expense, width: w, left: g.net >= 0 ? this.groupZero : this.groupZero - w };
    });

    // Categories: ranked, "Others" always last
    const cats = [...d.categories].sort((a, b) => (a.name === 'Others' ? 1 : b.name === 'Others' ? -1 : b.amount - a.amount));
    const catMax = Math.max(...cats.map(c => c.amount), 1);
    const catTotal = cats.reduce((s, c) => s + c.amount, 0) || 1;
    this.categoryRows = cats.map(c => ({ ...c, pct: (c.amount / catMax) * 100, share: (c.amount / catTotal) * 100 }));

    const accMax = Math.max(...d.accounts.map(a => a.balance), 1);
    this.accountRows = [...d.accounts].sort((a, b) => b.balance - a.balance)
      .map(a => ({ ...a, pct: (a.balance / accMax) * 100, share: (a.balance / (this.totalBalance || 1)) * 100 }));
  }

  private pctChange(now: number, before: number): number {
    return before ? ((now - before) / before) * 100 : 0;
  }

  // ---------- Monthly receipts vs payments ----------
  private buildMonthChart(months: MonthFlow[]): void {
    const max = Math.max(...months.flatMap(m => [m.receipts, m.payments]), 1);
    const top = this.niceMax(max);
    const plotH = CH.h - CH.padT - CH.padB;
    const plotW = CH.w - CH.padL - CH.padR;
    const band = plotW / Math.max(months.length, 1);
    const y = (v: number) => CH.padT + plotH - (v / top) * plotH;

    this.yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ y: y(top * f), label: this.compact(top * f) }));
    this.monthBars = months.map((m, i) => {
      const x = CH.padL + i * band;
      const groupW = CH.barW * 2 + CH.barGap;
      const x0 = x + (band - groupW) / 2;
      return {
        m, x, band,
        receiptsPath: this.barPath(x0, y(m.receipts), CH.barW, CH.padT + plotH - y(m.receipts)),
        paymentsPath: this.barPath(x0 + CH.barW + CH.barGap, y(m.payments), CH.barW, CH.padT + plotH - y(m.payments)),
        labelX: x + band / 2
      };
    });
  }

  /** Bar with 4px rounded top corners, square at the baseline. */
  private barPath(x: number, y: number, w: number, h: number): string {
    if (h <= 0) return '';
    const r = Math.min(4, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  }

  private niceMax(v: number): number {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 4 ? 4 : n <= 5 ? 5 : 10;
    return step * p;
  }

  private sparkPath(values: number[]): string {
    if (values.length < 2) return '';
    const max = Math.max(...values), min = Math.min(...values);
    const w = 96, h = 28, span = max - min || 1;
    return values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`).join('');
  }

  // ---------- Formatting ----------
  /** Indian short form: ₹1.2 Cr, ₹4.5 L, ₹12 K. */
  compact(v: number): string {
    const a = Math.abs(v), sign = v < 0 ? '−' : '';
    const fmt = (n: number) => (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)).replace(/\.?0+$/, '');
    if (a >= 1e7) return `${sign}₹${fmt(a / 1e7)} Cr`;
    if (a >= 1e5) return `${sign}₹${fmt(a / 1e5)} L`;
    if (a >= 1e3) return `${sign}₹${fmt(a / 1e3)} K`;
    return `${sign}₹${a.toFixed(0)}`;
  }

  inr(v: number): string {
    return (v < 0 ? '−' : '') + '₹' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  initials(name: string): string {
    return name.replace(/[^A-Za-z ]/g, ' ').split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  // ---------- Tooltip ----------
  /** Position relative to the chart container; the container's data-tip names which chart owns the tooltip. */
  private place(ev: MouseEvent, host: HTMLElement): { host: string; flip: boolean; x: number; y: number } {
    const r = host.getBoundingClientRect();
    const x = ev.clientX - r.left;
    return { host: host.dataset['tip'] || '', flip: x > r.width - 200, x, y: ev.clientY - r.top };
  }

  monthTip(ev: MouseEvent, host: HTMLElement, b: MonthBar): void {
    this.hoverMonth = b.m.month;
    this.tip = {
      ...this.place(ev, host),
      title: `${b.m.month} ${this.yearOf(b.m.month)}`,
      rows: [
        { label: 'Receipts', value: this.inr(b.m.receipts), swatch: 'var(--series-income)' },
        { label: 'Payments', value: this.inr(b.m.payments), swatch: 'var(--series-expense)' },
        { label: 'Net', value: this.inr(b.m.receipts - b.m.payments) }
      ]
    };
  }

  groupTip(ev: MouseEvent, host: HTMLElement, g: { name: string; income: number; expense: number; net: number }): void {
    this.tip = {
      ...this.place(ev, host),
      title: g.name,
      rows: [
        { label: 'Income', value: this.inr(g.income) },
        { label: 'Expense', value: this.inr(g.expense) },
        { label: g.net >= 0 ? 'Surplus' : 'Deficit', value: this.inr(g.net) }
      ]
    };
  }

  rowTip(ev: MouseEvent, host: HTMLElement, title: string, value: number, share: number, shareOf: string): void {
    this.tip = {
      ...this.place(ev, host),
      title,
      rows: [{ label: 'Amount', value: this.inr(value) }, { label: shareOf, value: share.toFixed(1) + '%' }]
    };
  }

  hideTip(): void {
    this.tip = null;
    this.hoverMonth = null;
  }

  /** Calendar year of a financial-year month label (Apr–Dec = first year). */
  private yearOf(month: string): number {
    const start = parseInt(this.data.financialYear, 10);
    return ['Jan', 'Feb', 'Mar'].includes(month) ? start + 1 : start;
  }

  get fyLabel(): string {
    return `FY ${this.data.financialYear}`;
  }
}
