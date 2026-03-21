'use client';

import { Scenario, PitStopResult } from '@/lib/types';

interface Props {
  scenario: Scenario;
  assessment: string;
  pitStopResults: PitStopResult[];
}

export default function Assessment({ scenario, assessment, pitStopResults }: Props) {
  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Leadership Assessment
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
          {scenario.name}
        </p>

        {/* Pit Stop History */}
        {pitStopResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
              Pit Stop Scores
            </h2>
            <div className="space-y-4">
              {pitStopResults.map((ps, idx) => (
                <div
                  key={idx}
                  className="p-4"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                    Pit Stop {idx + 1} — {ps.totalScore}/{ps.scores.length * 5}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ps.scores.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: s.score >= 4 ? 'rgba(27,107,90,0.08)' : s.score <= 2 ? 'rgba(155,59,59,0.08)' : 'rgba(196,152,90,0.08)',
                          color: s.score >= 4 ? 'var(--accent-primary)' : s.score <= 2 ? 'var(--accent-alert)' : 'var(--accent-secondary)',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {s.score}/5
                      </span>
                    ))}
                  </div>
                  {ps.pattern && (
                    <p className="text-sm mt-2 italic" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                      {ps.pattern}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Assessment */}
        <div
          className="p-6 mb-8"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Final Debrief
          </h2>
          <div
            className="text-sm whitespace-pre-wrap"
            style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.7' }}
          >
            {assessment}
          </div>
        </div>

        {/* Reflection */}
        <div
          className="p-8 text-center"
          style={{ background: 'var(--bg-tertiary)', borderRadius: '12px' }}
        >
          <p className="text-sm mb-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            Reflection
          </p>
          <p className="text-xl font-medium" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {scenario.reflectionPrompt}
          </p>
        </div>
      </div>
    </div>
  );
}
