'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { scenarios } from '@/lib/scenarios';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function FacilitatorSetup() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setLoading(true);
    setError('');
    const code = generateCode();
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createSession', code, scenarioId: selectedScenario }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create session.');
        setLoading(false);
        return;
      }
      router.push(`/facilitator/dashboard?code=${code}`);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  const difficultyOrder = { Foundation: 0, Intermediate: 1, Advanced: 2, Expert: 3 };

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Create Session
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
          Select a scenario and share the session code with your teams.
        </p>

        <div className="space-y-3 mb-8">
          {[...scenarios]
            .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
            .map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className="w-full text-left p-5 transition-all"
                style={{
                  background: selectedScenario === s.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  border: `1px solid ${selectedScenario === s.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                  borderRadius: '12px',
                  boxShadow: selectedScenario === s.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '16px' }}>
                    {s.name}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(27,107,90,0.08)', color: 'var(--accent-primary)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.difficulty}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(59,90,155,0.08)', color: 'var(--accent-info)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.track}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                    {s.duration}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5' }}>
                  {s.description}
                </p>
              </button>
            ))}
        </div>

        {error && (
          <p className="mb-4 text-sm" style={{ color: 'var(--accent-alert)', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
        )}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-8 py-3 text-base font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            background: 'var(--accent-primary)',
            color: '#fff',
            borderRadius: '8px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </div>
    </div>
  );
}
