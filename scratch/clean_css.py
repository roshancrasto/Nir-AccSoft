import os

def clean_css_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.css'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                new_lines = []
                changed = False
                for line in lines:
                    stripped = line.strip()
                    # Remove unnecessary hardcoded paddings/margins/borders
                    if stripped.startswith('padding: 24px') or stripped.startswith('padding: 20px'):
                        changed = True
                        continue
                    if stripped.startswith('border: 1px solid') or stripped.startswith('border-bottom: 1px solid'):
                        changed = True
                        continue
                    if stripped.startswith('box-shadow:'):
                        changed = True
                        continue
                    if stripped.startswith('border-radius: 12px') or stripped.startswith('border-radius: 16px'):
                        changed = True
                        continue
                    if stripped.startswith('background:') or stripped.startswith('background-color:'):
                        # Don't strip if it is transparent
                        if 'transparent' not in stripped:
                            changed = True
                            continue
                        
                    new_lines.append(line)
                
                if changed:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.writelines(new_lines)
                    print(f"Cleaned {filepath}")

if __name__ == '__main__':
    target_dir = os.path.join(os.getcwd(), 'Frontend', 'src', 'app', 'features')
    clean_css_files(target_dir)
