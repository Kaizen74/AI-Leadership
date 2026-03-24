'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, getStats } from '@/lib/analyticsStore';
import { PlayerProfile } from '@/lib/types';
import { scenarios } from '@/lib/scenarios';
import { getIndustry } from '@/lib/industries';

export default function ReportPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    if (p && p.sessions.length > 0) {
      generateReport(p);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateReport(p: PlayerProfile) {
    setLoading(true);
    setError('');

    const stats = getStats(p);
    const sessionSummaries = p.sessions.map((s) => {
      const scenario = scenarios.find((sc) => sc.id === s.scenarioId);
      const industry = getIndustry(s.industryId);
      const scores = s.criteriaScores.map((c) => `${c.criterion.split(' — ')[0]}: ${c.score}/5`).join(', ');
      return `- ${scenario?.name || s.scenarioId} (${industry?.name || s.industryId}, ${s.mode}, ${new Date(s.completedAt).toLocaleDateString()}): ${scores}`;
    }).join('\n');

    const criteriaBreakdown = Object.entries(stats.criteriaAverages)
      .map(([key, avg]) => `- ${key}: ${avg.toFixed(1)}/5`)
      .join('\n');

    const prompt = `Generate a leadership progression report for ${p.displayName}.

PROFILE DATA:
- Total sessions: ${stats.totalSessions}
- Average score: ${stats.averageScore.toFixed(1)}/5
- Scenarios completed: ${stats.scenariosCompleted.length}/7
- Industries explored: ${stats.industriesExplored.length}/8

SESSION HISTORY:
${sessionSummaries}

CRITERIA AVERAGES:
${criteriaBreakdown}

Write a professional leadership development report (400-600 words) that:
1. Summarizes overall progress and trajectory
2. Identifies top 2 strengths with evidence from scores
3. Identifies top 2 development areas with specific recommendations
4. Notes any patterns across different scenarios or industries
5. Provides 3 concrete next steps for continued development
6. Ends with an encouraging but realistic assessment of readiness

Write in a professional executive coaching tone. Address the leader directly.`;

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are an expert executive leadership development coach. Write professional, evidence-based progression reports for senior leaders.',
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 2048,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
      setReport(textBlock?.text || 'Report could not be generated.');
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  if (!profile || profile.sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
            Complete at least one session to generate a report.
          </p>
          <button
            onClick={() => router.push('/analytics')}
            className="px-6 py-3 text-sm font-medium"
            style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
              Progression Report
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
              {profile.displayName} — {new Date().toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => router.push('/analytics')}
            className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to Analytics
          </button>
        </div>

        {loading && (
          <p style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Generating your progression report...</p>
        )}

        {error && (
          <div className="mb-4 p-3 text-sm" style={{ background: 'rgba(155,59,59,0.08)', color: 'var(--accent-alert)', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}>
            {error}
          </div>
        )}

        {report && (
          <div
            className="p-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
          >
            <div
              className="text-sm whitespace-pre-wrap"
              style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.7' }}
            >
              {report}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
