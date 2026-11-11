import { Subject } from 'rxjs';

/** One selectable value in a filter list, e.g. a single donor. */
export interface FilterOption {
  key: string;
  label: string;
  count: number;
}

/** Describes one multi-select list in the filter panel (e.g. "Donor"). */
export interface FilterFieldDef<T> {
  id: string;
  label: string;
  /** Placeholder of the list's search box, e.g. "Search donors". */
  searchPlaceholder: string;
  /** Text shown when the list has no options, e.g. "No donors". */
  emptyText: string;
  /** Relative column width in the panel (CSS fr units). Default 1. */
  weight?: number;
  /** Stable identity of the row's value (prefer the id; fall back to the name). */
  keyOf: (row: T) => string;
  /** Display text of the row's value; rows without one are not offered as an option. */
  labelOf: (row: T) => string | null | undefined;
}

export class FilterField<T> {
  options: FilterOption[] = [];
  selected = new Set<string>();
  search = '';

  constructor(public def: FilterFieldDef<T>) {}

  get visibleOptions(): FilterOption[] {
    const q = this.search.trim().toLowerCase();
    return q ? this.options.filter(o => o.label.toLowerCase().includes(q)) : this.options;
  }

  labelFor(key: string): string {
    return this.options.find(o => o.key === key)?.label || '';
  }
}

/**
 * Client-side multi-select filter for a list page. Options are built from the loaded rows;
 * within a field any selected value matches (OR), across fields all must match (AND).
 */
export class ListFilter<T> {
  readonly fields: FilterField<T>[];
  /** Emits whenever the selection changes. */
  readonly changes = new Subject<void>();

  constructor(defs: FilterFieldDef<T>[]) {
    this.fields = defs.map(d => new FilterField<T>(d));
  }

  /** Rebuilds the options from the rows, keeping selections that still exist. */
  setData(rows: T[]): void {
    for (const field of this.fields) {
      const map = new Map<string, FilterOption>();
      for (const row of rows || []) {
        const label = (field.def.labelOf(row) || '').trim();
        if (!label) continue;
        const key = field.def.keyOf(row);
        const existing = map.get(key);
        if (existing) { existing.count++; } else { map.set(key, { key, label, count: 1 }); }
      }
      for (const k of Array.from(field.selected)) {
        if (!map.has(k)) field.selected.delete(k);
      }
      field.options = Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    }
  }

  matches(row: T): boolean {
    return this.fields.every(f => !f.selected.size || f.selected.has(f.def.keyOf(row)));
  }

  get activeCount(): number {
    return this.fields.reduce((n, f) => n + f.selected.size, 0);
  }

  /** Changes with the selection; useful for building a MatTableDataSource filter string. */
  get signature(): string {
    return this.fields.map(f => Array.from(f.selected).join(',')).join('|');
  }

  toggle(field: FilterField<T>, key: string): void {
    if (field.selected.has(key)) { field.selected.delete(key); } else { field.selected.add(key); }
    this.changes.next();
  }

  clear(field: FilterField<T>): void {
    field.selected.clear();
    this.changes.next();
  }

  clearAll(): void {
    this.fields.forEach(f => f.selected.clear());
    this.changes.next();
  }
}
