import re
import sys

try:
    with open(r'e:\Work\AccSoft\docs\donor_tmp\word\document.xml', 'r', encoding='utf-8') as f:
        content = f.read()
        texts = re.findall(r'<w:t>(.*?)</w:t>', content)
        print('\n'.join(texts))
except Exception as e:
    print(f"Error: {e}")
