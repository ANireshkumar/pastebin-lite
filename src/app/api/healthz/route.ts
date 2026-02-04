import { kv } from '@/lib/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple KV check
    await kv.set('health-check', 'ok', { ex: 1 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}