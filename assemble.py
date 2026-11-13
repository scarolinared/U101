from pathlib import Path
p=Path(__file__).parent
s=(p/'page.html').read_text().replace('/*DATA*/','const CONTENT = '+(p/'content.json').read_text().replace('\n','')+';//CONTENT_END').replace('/*QR*/',(p/'qr-inline.js').read_text()).replace('/*CORE*/',(p/'core.js').read_text().replace('export function','function'))
(p/'Carolina_Trivia.html').write_text(s)
