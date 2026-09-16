import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

if len(sys.argv) > 1:
    xml_path = sys.argv[1]
else:
    xml_path = r'e:\Work\AccSoft\Docs\payment_tmp\word\document.xml'

if os.path.exists(xml_path):
    with open(xml_path, 'r', encoding='utf-8') as f:
        content = f.read()
        texts = re.findall(r'<w:t>(.*?)</w:t>', content)
        print('\n'.join(texts))
else:
    print(f"File not found: {xml_path}")
