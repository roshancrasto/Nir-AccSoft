import zipfile
import xml.etree.ElementTree as ET

def extract_text(docx_path):
    with zipfile.ZipFile(docx_path) as docx:
        xml_content = docx.read('word/document.xml')
    
    tree = ET.XML(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    paragraphs = []
    for p in tree.findall('.//w:p', ns):
        texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    
    return '\n'.join(paragraphs)

print(extract_text("Docs/Internal Event Expenses.docx"))
