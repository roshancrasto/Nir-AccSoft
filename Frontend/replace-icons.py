import os
import glob

html_files = glob.glob('e:/Work/AccSoft/Frontend/src/app/features/transactions/*/*.component.html')

for filepath in html_files:
    if 'dialog' in filepath:
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace edit icon
    content = content.replace('<i class="fa-solid fa-pen"></i>', '<mat-icon style="font-size: 18px; width: 18px; height: 18px;">edit</mat-icon>')
    
    # Replace delete icon
    content = content.replace('<i class="fa-solid fa-trash"></i>', '<mat-icon style="font-size: 18px; width: 18px; height: 18px;">delete</mat-icon>')
    
    # Replace add icon
    content = content.replace('<i class="fa-solid fa-plus"></i>', '<mat-icon style="font-size: 20px; width: 20px; height: 20px; margin-right: 4px;">add</mat-icon>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Processed {filepath}')
