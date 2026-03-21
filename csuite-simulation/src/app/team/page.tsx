'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamJoin() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !teamName.trim()) {
      setError('Please enter both a session code and team name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'joinTeam', code: code.trim().toUpperCase(), teamName: teamName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to join session.');
        setLoading(false);
        return;
      }
      const params = new URLSearchParams({
        code: code.trim().toUpperCase(),
        team: teamName.trim(),
        scenario: data.scenarioId,
      });
      router.push(`/team/play?${params.toString()}`);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Join Session
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
          Enter the session code from your facilitator and choose a team name.
        </p>

        <form onSubmit={handleJoin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
              Session Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABCDE"
              maxLength={10}
              className="w-full px-4 py-3 text-lg tracking-widest text-center outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Team Alpha"
              className="w-full px-4 py-3 outline-none"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
              }}
            />
          </div>

          {error && (
            <p className="mb-4 text-sm text-center" style={{ color: 'var(--accent-alert)', fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? 'Joining...' : 'Join Session'}
          </button>
        </form>
      </div>
    </div>
  );
}
