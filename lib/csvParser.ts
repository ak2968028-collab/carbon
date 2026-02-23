import fs from 'fs';
import path from 'path';

export function parseCSV(filePath: string): Record<string, string>[] {
  const fullPath = path.join(process.cwd(), 'public', 'Clean2', filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

export function readCSVRaw(filePath: string): string {
  const fullPath = path.join(process.cwd(), 'public', 'Clean2', filePath);
  return fs.readFileSync(fullPath, 'utf-8');
}
