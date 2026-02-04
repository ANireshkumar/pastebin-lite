import { kv } from '@/lib/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const pasteData = await kv.get(`paste:${id}`);

    if (!pasteData) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    const paste = JSON.parse(pasteData as string);

    // Determine current time
    const testMode = process.env.TEST_MODE === '1';
    const testNowHeader = request.headers.get('x-test-now-ms');
    const now = testMode && testNowHeader ? parseInt(testNowHeader) : Date.now();

    // Check expiry
    if (paste.expires_at && now > paste.expires_at) {
      return NextResponse.json({ error: 'Paste expired' }, { status: 404 });
    }

    // Check view limit
    if (paste.max_views && paste.current_views >= paste.max_views) {
      return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 });
    }

    // Increment views
    paste.current_views += 1;
    await kv.set(`paste:${id}`, JSON.stringify(paste));

    const remaining_views = paste.max_views ? paste.max_views - paste.current_views : null;

    return NextResponse.json({
      content: paste.content,
      remaining_views,
      expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}