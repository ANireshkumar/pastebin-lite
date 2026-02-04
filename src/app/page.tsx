'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState<number | ''>('');
  const [maxViews, setMaxViews] = useState<number | ''>('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUrl('');

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl || undefined,
          max_views: maxViews || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error);
        return;
      }

      const data = await res.json();
      setUrl(data.url);
    } catch {
      setError('Failed to create paste');
    }
  };

  return (
    <div>
      <h1>Create a Paste</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here"
          required
        />
        <input
          type="number"
          value={ttl}
          onChange={(e) => setTtl(e.target.value ? parseInt(e.target.value) : '')}
          placeholder="TTL in seconds (optional)"
          min="1"
        />
        <input
          type="number"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value ? parseInt(e.target.value) : '')}
          placeholder="Max views (optional)"
          min="1"
        />
        <button type="submit">Create Paste</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {url && <p>Share this link: <a href={url}>{url}</a></p>}
    </div>
  );
}