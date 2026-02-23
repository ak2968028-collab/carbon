import { NextResponse } from 'next/server';
import { parseCSV } from '@/lib/csvParser';

export async function GET() {
  try {
    const before = parseCSV('CARBON_BUDGET(Before Interventions).csv');
    const after = parseCSV('CARBON_BUDGET(After Interventions).csv');
    return NextResponse.json({ success: true, before, after });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
