import zipfile
import re

def get_docx_text(path):
    with zipfile.ZipFile(path, 'r') as zip_ref:
        xml_content = zip_ref.read('word/document.xml').decode('utf-8')
        # Extract all text between > and < tags
        texts = re.findall(r'>([^<]+)<', xml_content)
        return ' '.join([t.strip() for t in texts if t.strip()])

if __name__ == "__main__":
    text = get_docx_text(r'e:\Work\AccSoft\Docs\Account Summary Enhancement Sum.docx')
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(text)
