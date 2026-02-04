import { kv } from '@/lib/kv';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { content, ttl_seconds, max_views } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required and must be a non-empty string' }, { status: 400 });
    }

    if (ttl_seconds !== undefined && (typeof ttl_seconds !== 'number' || ttl_seconds < 1)) {
      return NextResponse.json({ error: 'ttl_seconds must be an integer >= 1' }, { status: 400 });
    }

    if (max_views !== undefined && (typeof max_views !== 'number' || max_views < 1)) {
      return NextResponse.json({ error: 'max_views must be an integer >= 1' }, { status: 400 });
    }

    const id = randomUUID();
    const created_at = Date.now();
    const expires_at = ttl_seconds ? created_at + ttl_seconds * 1000 : null;

    const paste = {
      content: content.trim(),
      created_at,
      expires_at,
      max_views,
      current_views: 0,
    };

    await kv.set(`paste:${id}`, JSON.stringify(paste));

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`;

    return NextResponse.json({ id, url });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}