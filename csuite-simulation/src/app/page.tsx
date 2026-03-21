'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] w-full text-center">
        <h1
          className="text-5xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}
        >
          AI Leadership Simulation
        </h1>
        <p
          className="text-lg mb-12 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}
        >
          Practice leading AI transformation through realistic, high-stakes
          business simulations designed for C-suite executives.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => router.push('/facilitator')}
            className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-90"
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Facilitator
          </button>
          <button
            onClick={() => router.push('/team')}
            className="px-8 py-4 text-base font-medium transition-opacity hover:opacity-90"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Team
          </button>
        </div>
      </div>
    </div>
  );
}
