'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { scenarios } from '@/lib/scenarios';
import { TeamState, PitStopResult } from '@/lib/types';
import { getIndustry } from '@/lib/industries';

interface TeamData {
  [teamName: string]: TeamState;
}

function generatePatterns(teams: TeamData, criteriaCount: number): string[] {
  const entries = Object.values(teams).filter((t) => t.pitStopResults.length > 0);
  if (entries.length < 2) return [];

  const patterns: string[] = [];
  const teamCount = entries.length;

  // Average scores per criterion
  const avgScores: number[] = [];
  for (let i = 0; i < criteriaCount; i++) {
    let sum = 0;
    let count = 0;
    for (const team of entries) {
      const lastPitStop = team.pitStopResults[team.pitStopResults.length - 1];
      if (lastPitStop.scores[i]) {
        sum += lastPitStop.scores[i].score;
        count++;
      }
    }
    avgScores.push(count > 0 ? sum / count : 0);
  }

  // Find highest and lowest scoring criteria
  if (avgScores.length >= 2) {
    let maxIdx = 0, minIdx = 0;
    for (let i = 1; i < avgScores.length; i++) {
      if (avgScores[i] > avgScores[maxIdx]) maxIdx = i;
      if (avgScores[i] < avgScores[minIdx]) minIdx = i;
    }
    const scenario = scenarios.find((s) =>
      entries.some((t) => t.scenarioId === s.id)
    );
    if (scenario && maxIdx !== minIdx) {
      const highCrit = scenario.assessmentCriteria[maxIdx]?.split(' — ')[0] || `Criterion ${maxIdx + 1}`;
      const lowCrit = scenario.assessmentCriteria[minIdx]?.split(' — ')[0] || `Criterion ${minIdx + 1}`;
      patterns.push(
        `Teams averaged ${avgScores[maxIdx].toFixed(1)}/5 on ${highCrit} but only ${avgScores[minIdx].toFixed(1)}/5 on ${lowCrit}.`
      );
    }
  }

  // Status-based patterns
  const completedCount = entries.filter((t) => t.status === 'completed').length;
  if (completedCount > 0) {
    patterns.push(`${completedCount} of ${teamCount} teams have completed their assessment.`);
  }

  // Pattern from pit stop observations
  const allPatterns = entries
    .flatMap((t) => t.pitStopResults.map((p) => p.pattern))
    .filter(Boolean);
  if (allPatterns.length > 0) {
    patterns.push(allPatterns[allPatterns.length - 1]);
  }

  return patterns.slice(0, 3);
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const [teams, setTeams] = useState<TeamData>({});
  const [scenarioId, setScenarioId] = useState('');
  const [industryId, setIndustryId] = useState('');
  const [reflectionMode, setReflectionMode] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [reflectionTimer, setReflectionTimer] = useState(120);
  const [reflectionActive, setReflectionActive] = useState(false);

  const scenario = scenarios.find((s) => s.id === scenarioId);
  const industry = getIndustry(industryId);

  const fetchTeams = useCallback(async () => {
    if (!code) return;
    try {
      const res = await fetch(`/api/session?code=${code}&action=allTeams`);
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams || {});
        if (data.scenarioId) setScenarioId(data.scenarioId);
        if (data.industryId) setIndustryId(data.industryId);
      }
    } catch {
      // Retry on next poll
    }
  }, [code]);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 5000);
    return () => clearInterval(interval);
  }, [fetchTeams]);

  useEffect(() => {
    if (!reflectionActive || reflectionTimer <= 0) return;
    const interval = setInterval(() => {
      setReflectionTimer((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [reflectionActive, reflectionTimer]);

  const teamEntries = Object.entries(teams);
  const statusColors: Record<string, { bg: string; color: string }> = {
    joined: { bg: 'rgba(59,90,155,0.08)', color: 'var(--accent-info)' },
    briefing: { bg: 'rgba(59,90,155,0.08)', color: 'var(--accent-info)' },
    playing: { bg: 'rgba(27,107,90,0.08)', color: 'var(--accent-primary)' },
    pitstop: { bg: 'rgba(196,152,90,0.08)', color: 'var(--accent-secondary)' },
    completed: { bg: 'rgba(27,107,90,0.15)', color: 'var(--accent-primary)' },
  };

  const patterns = generatePatterns(teams, scenario?.assessmentCriteria.length || 5);

  // Reflection mode — full screen
  if (reflectionMode && scenario) {
    const mins = Math.floor(reflectionTimer / 60);
    const secs = reflectionTimer % 60;
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-12"
        style={{ background: 'var(--bg-tertiary)' }}
        onClick={() => {
          if (!reflectionActive) {
            setReflectionActive(true);
          }
        }}
      >
        <p className="text-3xl font-medium text-center max-w-3xl mb-12" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', lineHeight: '1.5' }}>
          {scenario.reflectionPrompt}
        </p>
        <span
          className="text-4xl font-semibold mb-8"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: reflectionTimer <= 30 ? 'var(--accent-alert)' : 'var(--text-secondary)',
          }}
        >
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
        {!reflectionActive && (
          <p className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            Click anywhere to start timer
          </p>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setReflectionMode(false); }}
          className="mt-8 text-sm px-4 py-2"
          style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif", background: 'transparent', border: '1px solid var(--border-medium)', borderRadius: '8px' }}
        >
          Exit Reflection Mode
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="px-8 py-6" style={{ background: 'var(--surface-darker)' }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-on-dark)' }}>
              Facilitator Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
              {scenario?.name || 'Loading...'}{industry ? ` · ${industry.icon} ${industry.name}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                Session Code
              </p>
              <p className="text-3xl font-semibold tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-on-dark)' }}>
                {code}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => { setReflectionMode(true); setReflectionTimer(120); setReflectionActive(false); }}
            className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-primary)', color: '#fff', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
          >
            Reflection Prompt Mode
          </button>
          <button
            onClick={() => setShowScores(!showScores)}
            className="px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}
          >
            {showScores ? 'Hide Scores' : 'View Team Scores (Private)'}
          </button>
        </div>

        {/* Team Status Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Teams ({teamEntries.length})
          </h2>
          {teamEntries.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
              Waiting for teams to join...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamEntries.map(([name, team]) => {
                const sc = statusColors[team.status] || statusColors.joined;
                return (
                  <div
                    key={name}
                    className="p-5"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text-primary)', fontSize: '15px' }}>
                        {name}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full capitalize"
                        style={{ background: sc.bg, color: sc.color, fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {team.status}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: "'JetBrains Mono', monospace" }}>
                      Turn {team.turn} | Pit stops: {team.pitStopResults?.length || 0}
                    </p>

                    {/* Private scores */}
                    {showScores && team.pitStopResults && team.pitStopResults.length > 0 && (
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                        {team.pitStopResults.map((ps: PitStopResult, idx: number) => (
                          <div key={idx} className="mb-2">
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                              Pit Stop {idx + 1}: {ps.totalScore}/{ps.scores.length * 5}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {ps.scores.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-1.5 py-0.5 rounded"
                                  style={{
                                    background: s.score >= 4 ? 'rgba(27,107,90,0.1)' : s.score <= 2 ? 'rgba(155,59,59,0.1)' : 'rgba(196,152,90,0.1)',
                                    color: s.score >= 4 ? 'var(--accent-primary)' : s.score <= 2 ? 'var(--accent-alert)' : 'var(--accent-secondary)',
                                    fontFamily: "'JetBrains Mono', monospace",
                                  }}
                                >
                                  {s.score}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pattern Observatory */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Pattern Observatory
          </h2>
          {patterns.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
              Patterns will appear after 2 or more teams complete a pit stop.
            </p>
          ) : (
            <div className="space-y-3">
              {patterns.map((p, i) => (
                <div
                  key={i}
                  className="p-4"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}
                >
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5' }}>
                    {p}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pit Stop Discussion Prompts */}
        {scenario && teamEntries.some(([, t]) => t.status === 'pitstop') && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent-secondary)' }}>
              Pit Stop In Progress — Discussion Prompts
            </h2>
            <ul className="space-y-2">
              {scenario.pitStopQuestions.map((q, i) => (
                <li
                  key={i}
                  className="p-3 text-sm"
                  style={{
                    background: 'rgba(196,152,90,0.06)',
                    border: '1px solid rgba(196,152,90,0.15)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: '1.5',
                  }}
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
