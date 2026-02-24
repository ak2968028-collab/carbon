import { NextResponse } from 'next/server';
import { parseCSV } from '@/lib/csvParser';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vlcode = searchParams.get('vlcode') || '';
    const beforeAll = parseCSV('Carbon_Budget_Before.csv');
    const afterAll  = parseCSV('Carbon_Budget_After.csv');
    const before = vlcode ? beforeAll.filter(r => r.vlcode === vlcode) : beforeAll;
    const after  = vlcode ? afterAll.filter(r => r.vlcode === vlcode)  : afterAll;
    return NextResponse.json({ success: true, before, after });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
