import { notFound } from 'next/navigation';

interface PastePageProps {
  params: { id: string };
}

export default async function PastePage({ params }: PastePageProps) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pastes/${id}`, {
      headers: {
        'x-test-now-ms': process.env.TEST_MODE === '1' ? Date.now().toString() : undefined,
      },
    });

    if (!res.ok) {
      notFound();
    }

    const paste = await res.json();

    return (
      <div>
        <h1>Paste</h1>
        <pre>{paste.content}</pre>
      </div>
    );
  } catch {
    notFound();
  }
}