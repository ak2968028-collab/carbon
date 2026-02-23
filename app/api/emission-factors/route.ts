import { NextResponse } from 'next/server';
import { parseCSV } from '@/lib/csvParser';

export async function GET() {
  try {
    const data = parseCSV('emission_factor.csv');
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
