import fs from 'fs';
import path from 'path';

export function parseCSV(filename: string): Record<string, string>[] {
  const fullPath = path.join(process.cwd(), 'public', 'Clean2', filename);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { values.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    values.push(cur.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
    return obj;
  });
}

export function filterByVlcode(rows: Record<string, string>[], vlcode: string) {
  return rows.filter(r => r.vlcode === vlcode);
}
