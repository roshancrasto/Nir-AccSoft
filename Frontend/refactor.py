import os
import re
import glob

html_files = glob.glob('e:/Work/AccSoft/Frontend/src/app/features/transactions/*/*.component.html')

for filepath in html_files:
    if 'receipts' in filepath or 'dialog' in filepath:
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract title
    title_match = re.search(r'<h1>(.*?)</h1>', content)
    title = title_match.group(1) if title_match else 'Transaction'
    
    # Extract button text
    btn_match = re.search(r'<button[^>]*openAddDialog\(\)[^>]*>.*?<mat-icon>add</mat-icon>(.*?)</button>', content, re.DOTALL)
    btn_text = btn_match.group(1).strip() if btn_match else 'New'
    
    # New header string
    new_header = f'''  <!-- KPI CARDS -->
  <div class="cards">
    <div class="card blue">
      <h4>Total {title}s</h4>
      <h2>{{{{ dataSource.data.length || 0 }}}}</h2>
    </div>
    <div class="card green">
      <h4>Total Amount</h4>
      <h2>{{{{ 0 | currency:'INR':'symbol':'1.0-0' }}}}</h2>
    </div>
    <div class="card orange">
      <h4>This Month</h4>
      <h2>{{{{ 0 | currency:'INR':'symbol':'1.0-0' }}}}</h2>
    </div>
    <div class="card purple">
      <h4>Pending</h4>
      <h2>0</h2>
    </div>
  </div>

  <!-- HEADER / FILTERS -->
  <div class="filter-panel" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px;">
    <div class="filter-row" style="flex: 1; justify-content: flex-start;">
      <input type="text" placeholder="Search" (keyup)="applyFilter($event)" style="min-width: 150px; padding: 8px 12px;">
    </div>
    
    <div style="flex: 1; text-align: center;">
      <h2 class="text-gradient" style="margin: 0; font-size: 26px;">{title}</h2>
    </div>

    <div style="flex: 1; text-align: right; display: flex; justify-content: flex-end;">
      <button [disabled]="!canAdd" class="btn-gradient" (click)="openAddDialog()">
        <i class="fa-solid fa-plus"></i> {btn_text}
      </button>
    </div>
  </div>'''

    # Replace old mat-card page-header
    content = re.sub(r'<mat-card class="page-header">.*?</mat-card>', new_header, content, flags=re.DOTALL)
    
    # Replace mat-card table-card
    content = content.replace('<mat-card class="table-card">', '<div class="table-card">')
    # Replace last </mat-card> with </div>
    if '</mat-card>' in content:
        parts = content.rsplit('</mat-card>', 1)
        content = '</div>'.join(parts)
        
    # Replace table components
    content = content.replace('class="mat-elevation-z0"', '')
    content = content.replace('class="status-chip"', 'class="badge"')
    content = content.replace('class="action-buttons"', 'class="actions"')
    
    # Replace mat-icon-button for edit
    content = re.sub(r'<button [^>]*mat-icon-button color="primary" \(click\)="openEditDialog\((.*?)\)"[^>]*>.*?<mat-icon>edit</mat-icon>.*?</button>', r'<button [disabled]="!canEdit" class="btn-edit" (click)="openEditDialog(\1)" title="Edit">' + '\n              <i class="fa-solid fa-pen"></i>\n            </button>', content, flags=re.DOTALL)
    
    # Replace mat-icon-button for delete
    content = re.sub(r'<button [^>]*mat-icon-button color="warn" \(click\)="([a-zA-Z0-9_]+)\((.*?)\)"[^>]*>.*?<mat-icon>delete</mat-icon>.*?</button>', r'<button [disabled]="!canDelete" class="btn-delete" (click)="\1(\2)" title="Delete">' + '\n              <i class="fa-solid fa-trash"></i>\n            </button>', content, flags=re.DOTALL)
    
    # remove mat-form-field search 
    content = re.sub(r'<div class="table-header">\s*<mat-form-field.*?</mat-form-field>\s*</div>', '<div class="table-header">\n      <h3>Register</h3>\n    </div>', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Processed {filepath}')
