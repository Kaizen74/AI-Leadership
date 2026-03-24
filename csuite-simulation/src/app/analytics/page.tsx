'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, createProfile, saveProfile, getStats } from '@/lib/analyticsStore';
import { PlayerProfile } from '@/lib/types';
import { scenarios } from '@/lib/scenarios';
import { getIndustry } from '@/lib/industries';
import { RadarChart, TrendChart } from '@/components/ProgressionChart';

export default function AnalyticsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setLoaded(true);
  }, []);

  function handleCreateProfile() {
    if (!nameInput.trim()) return;
    const p = createProfile(nameInput.trim());
    setProfile(p);
  }

  function handleUpdateName() {
    if (!profile || !nameInput.trim()) return;
    profile.displayName = nameInput.trim();
    saveProfile(profile);
    setProfile({ ...profile });
    setNameInput('');
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  // No profile yet — show setup
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            My Progress
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
            Create a profile to track your leadership development across sessions.
          </p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 mb-4 outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
            }}
          />
          <button
            onClick={handleCreateProfile}
            disabled={!nameInput.trim()}
            className="w-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const stats = getStats(profile);

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
              {profile.displayName}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
              {stats.totalSessions} session{stats.totalSessions !== 1 ? 's' : ''} completed
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/analytics/report')}
              disabled={stats.totalSessions === 0}
              className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
            >
              Generate Report
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
            >
              Home
            </button>
          </div>
        </div>

        {stats.totalSessions === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
              No sessions completed yet.
            </p>
            <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
              Complete a simulation to see your analytics here.
            </p>
            <button
              onClick={() => router.push('/solo')}
              className="px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
            >
              Start Solo Practice
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Sessions</p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{stats.totalSessions}</p>
              </div>
              <div className="p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Avg Score</p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--accent-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{stats.averageScore.toFixed(1)}/5</p>
              </div>
              <div className="p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Scenarios</p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{stats.scenariosCompleted.length}/7</p>
              </div>
              <div className="p-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Industries</p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{stats.industriesExplored.length}/8</p>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Radar Chart */}
              {Object.keys(stats.criteriaAverages).length >= 3 && (
                <div className="p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                    Competency Profile
                  </h2>
                  <RadarChart data={stats.criteriaAverages} />
                </div>
              )}

              {/* Trend Chart */}
              {stats.recentTrend.length >= 2 && (
                <div className="p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                    Score Trend
                  </h2>
                  <TrendChart points={stats.recentTrend} />
                </div>
              )}
            </div>

            {/* Session History */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                Session History
              </h2>
              <div className="space-y-3">
                {[...profile.sessions].reverse().map((s) => {
                  const scenario = scenarios.find((sc) => sc.id === s.scenarioId);
                  const industry = getIndustry(s.industryId);
                  const avgScore = s.criteriaScores.length > 0
                    ? s.criteriaScores.reduce((sum, c) => sum + c.score, 0) / s.criteriaScores.length
                    : 0;
                  return (
                    <div
                      key={s.id}
                      className="p-4 flex items-center justify-between"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
                          {scenario?.name || s.scenarioId}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                          {industry ? `${industry.icon} ${industry.name}` : s.industryId} · {s.mode} · {s.turns} turns · {new Date(s.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="text-lg font-semibold"
                        style={{
                          color: avgScore >= 4 ? 'var(--accent-primary)' : avgScore <= 2 ? 'var(--accent-alert)' : 'var(--accent-secondary)',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {avgScore.toFixed(1)}/5
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Edit name */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Update display name"
                className="px-4 py-2 text-sm outline-none"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                onClick={handleUpdateName}
                disabled={!nameInput.trim()}
                className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Update Name
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
