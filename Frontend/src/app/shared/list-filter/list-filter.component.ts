import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ListFilter } from './list-filter';

/** "Filter" button with a side-by-side multi-select panel. */
@Component({
  selector: 'app-list-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatMenuModule, MatCheckboxModule, MatIconModule],
  template: `
    <button type="button" class="filter-btn" [class.active]="filter.activeCount > 0" [matMenuTriggerFor]="filterMenu">
      <mat-icon>filter_list</mat-icon>
      <span>Filter</span>
      <span class="filter-count" *ngIf="filter.activeCount > 0">{{ filter.activeCount }}</span>
    </button>

    <mat-menu #filterMenu="matMenu" class="filter-menu" xPosition="after">
      <div class="filter-panel" [style.width.px]="panelWidth"
           (click)="$event.stopPropagation()" (keydown)="$event.key !== 'Escape' && $event.stopPropagation()">
        <div class="fp-head">
          <span class="fp-title">{{ title }}</span>
          <button type="button" class="fp-link" *ngIf="filter.activeCount > 0" (click)="filter.clearAll()">Clear all</button>
        </div>

        <div class="fp-body" [style.grid-template-columns]="columns">
          <div class="fp-section" *ngFor="let f of filter.fields">
            <div class="fp-label">
              <span>{{ f.def.label }} <em *ngIf="f.selected.size">{{ f.selected.size }} selected</em></span>
              <button type="button" class="fp-link" *ngIf="f.selected.size" (click)="filter.clear(f)">Clear</button>
            </div>
            <input class="fp-search" type="search" [placeholder]="f.def.searchPlaceholder" [(ngModel)]="f.search">
            <div class="fp-list">
              <mat-checkbox *ngFor="let o of f.visibleOptions" [checked]="f.selected.has(o.key)" (change)="filter.toggle(f, o.key)">
                <span class="fp-opt" [title]="o.label">{{ o.label }}</span><span class="fp-count">{{ o.count }}</span>
              </mat-checkbox>
              <div class="fp-empty" *ngIf="f.visibleOptions.length === 0">{{ f.def.emptyText }}</div>
            </div>
          </div>
        </div>
      </div>
    </mat-menu>
  `,
  styles: [`
    :host { display: inline-flex; }

    .filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 12px 0 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--ink-2);
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color .15s ease, border-color .15s ease;
    }
    .filter-btn:hover { background: var(--canvas); border-color: var(--line-strong, #d1d1d6); }
    .filter-btn:focus { outline: none; }
    .filter-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
    .filter-btn .mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ink-muted); }
    .filter-btn.active { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-ink); }
    .filter-btn.active .mat-icon { color: var(--accent-ink); }
    .filter-count {
      display: inline-grid;
      place-items: center;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 9px;
      background: var(--accent);
      color: var(--ink);
      font-size: 11px;
      font-weight: 700;
    }

    /* Panel (rendered in the menu overlay) */
    .filter-panel { max-width: calc(100vw - 32px); padding: 4px 0; font-family: 'Inter', sans-serif; }
    .fp-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 14px 10px;
      border-bottom: 1px solid var(--line);
    }
    .fp-title { font-size: 13.5px; font-weight: 650; color: var(--ink); }
    .fp-body { display: grid; }
    .fp-section { min-width: 0; padding: 10px 14px 6px; }
    .fp-section + .fp-section { border-left: 1px solid var(--line); }
    .fp-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: var(--ink-muted);
    }
    .fp-label em { margin-left: 4px; font-style: normal; font-weight: 600; text-transform: none; letter-spacing: 0; color: var(--accent-ink); }
    .fp-link {
      border: 0;
      background: none;
      padding: 0;
      color: var(--accent-ink);
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0;
      cursor: pointer;
    }
    .fp-link:hover { text-decoration: underline; }
    .fp-search {
      width: 100%;
      box-sizing: border-box;
      height: 30px;
      padding: 0 10px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: var(--field, #fbfbfc);
      font-family: inherit;
      font-size: 13px;
      color: var(--ink);
    }
    .fp-search:focus { outline: none; border-color: var(--accent); box-shadow: var(--accent-ring); }
    .fp-list { max-height: 260px; overflow-y: auto; margin: 4px -4px 0; }
    .fp-list .mat-mdc-checkbox { display: flex; width: 100%; }
    .fp-list ::ng-deep .mdc-form-field { width: 100%; }
    .fp-list ::ng-deep .mdc-form-field > label {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 0;
      font-size: 13px;
      color: var(--ink);
      cursor: pointer;
    }
    .fp-opt { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .fp-count { margin-right: 6px; font-size: 11.5px; color: var(--ink-faint, #a1a1a6); font-variant-numeric: tabular-nums; }
    .fp-empty { padding: 8px 4px; font-size: 12.5px; color: var(--ink-muted); }

    @media (max-width: 640px) {
      .fp-body { grid-template-columns: 1fr !important; }
      .fp-section + .fp-section { border-left: 0; border-top: 1px solid var(--line); }
    }
  `]
})
export class ListFilterComponent {
  @Input({ required: true }) filter!: ListFilter<any>;
  @Input() title = 'Filter';
  @Input() panelWidth = 760;

  get columns(): string {
    return this.filter.fields.map(f => `${f.def.weight || 1}fr`).join(' ');
  }
}
