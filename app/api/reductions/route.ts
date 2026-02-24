import { NextResponse } from 'next/server';
import { parseCSV } from '@/lib/csvParser';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vlcode = searchParams.get('vlcode') || '';
    const all = parseCSV('Carbon_Reduction_After.csv');
    const data = vlcode ? all.filter(r => r.vlcode === vlcode) : all;
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
