'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Scenario, PitStopResult } from '@/lib/types';
import { Industry } from '@/lib/industries';
import { addSessionRecord, createSessionRecord } from '@/lib/analyticsStore';

interface Props {
  scenario: Scenario;
  assessment: string;
  pitStopResults: PitStopResult[];
  industry?: Industry;
  turns?: number;
}

export default function SoloAssessment({ scenario, assessment, pitStopResults, industry, turns = 0 }: Props) {
  const router = useRouter();
  const savedRef = useRef(false);

  // Save session to analytics on mount
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    // Extract scores from the last pit stop if available
    const lastPitStop = pitStopResults[pitStopResults.length - 1];
    const criteriaScores = lastPitStop
      ? lastPitStop.scores.map((s) => ({ criterion: s.criterion, score: s.score }))
      : scenario.assessmentCriteria.map((c) => ({ criterion: c, score: 3 }));

    const record = createSessionRecord(
      scenario.id,
      industry?.id || 'aviation_logistics',
      'solo',
      turns,
      pitStopResults,
      assessment,
      criteriaScores,
    );
    addSessionRecord(record);
  }, [scenario, industry, pitStopResults, assessment, turns]);

  function handleRetry() {
    const params = new URLSearchParams({
      scenario: scenario.id,
      industry: industry?.id || 'aviation_logistics',
    });
    router.push(`/solo/play?${params.toString()}`);
  }

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Leadership Assessment
        </h1>
        <div className="flex items-center gap-3 mb-8">
          <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
            {scenario.name}
          </p>
          {industry && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(196,152,90,0.08)', color: 'var(--accent-secondary)', fontFamily: "'DM Sans', sans-serif" }}
            >
              {industry.icon} {industry.name}
            </span>
          )}
        </div>

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
          className="p-8 mb-8 text-center"
          style={{ background: 'var(--bg-tertiary)', borderRadius: '12px' }}
        >
          <p className="text-sm mb-2 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            Reflection
          </p>
          <p className="text-xl font-medium" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {scenario.reflectionPrompt}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/solo')}
            className="px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Choose Different Scenario
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
            style={{
              background: 'transparent',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
