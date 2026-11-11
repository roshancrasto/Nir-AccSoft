import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ListFilter } from './list-filter';

/** Removable chips for the active selections of a ListFilter, with a "x of y" count. */
@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="filter-chips" *ngIf="filter.activeCount > 0">
      <ng-container *ngFor="let f of filter.fields">
        <span class="chip" *ngFor="let k of f.selected">
          <span class="chip-kind">{{ f.def.label }}</span>{{ f.labelFor(k) }}
          <button type="button" aria-label="Remove" (click)="filter.toggle(f, k)"><mat-icon>close</mat-icon></button>
        </span>
      </ng-container>
      <button type="button" class="chips-clear" (click)="filter.clearAll()">Clear all</button>
      <span class="chips-result">{{ shown }} of {{ total }} {{ noun }}</span>
    </div>
  `,
  styles: [`
    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-bottom: 1px solid var(--line);
      background: #fcfcfd;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 4px 0 10px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: #fff;
      font-size: 12.5px;
      color: var(--ink);
    }
    .chip-kind { color: var(--ink-muted); font-size: 11.5px; }
    .chip button {
      display: grid;
      place-items: center;
      width: 18px;
      height: 18px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--ink-muted);
      cursor: pointer;
    }
    .chip button:hover { background: var(--canvas); color: var(--ink); }
    .chip button .mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .chips-clear {
      border: 0;
      background: none;
      padding: 0 4px;
      color: var(--accent-ink);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .chips-clear:hover { text-decoration: underline; }
    .chips-result { margin-left: auto; font-size: 12px; color: var(--ink-muted); }
  `]
})
export class FilterChipsComponent {
  @Input({ required: true }) filter!: ListFilter<any>;
  @Input() shown = 0;
  @Input() total = 0;
  @Input() noun = 'records';
}
