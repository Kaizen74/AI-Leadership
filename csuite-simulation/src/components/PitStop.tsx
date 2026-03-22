'use client';

import { useState, useEffect, useCallback } from 'react';
import { Scenario, Message, PitStopResult, CriterionScore } from '@/lib/types';

interface Props {
  scenario: Scenario;
  messages: Message[];
  onComplete: (result: PitStopResult) => void;
  onScoresReady?: (result: PitStopResult) => void;
}

export default function PitStop({ scenario, messages, onComplete, onScoresReady }: Props) {
  const [scores, setScores] = useState<CriterionScore[] | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [pattern, setPattern] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const fetchScores = useCallback(async () => {
    const prompt = `You are assessing a leadership simulation mid-point. Score the team's performance so far.

SCENARIO: ${scenario.name}
CRITERIA:
${scenario.assessmentCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

TRANSCRIPT SO FAR:
${messages.map((m) => `${m.role === 'user' ? 'LEADER' : 'SIMULATION'}: ${m.content}`).join('\n\n')}

Respond with ONLY valid JSON in this exact format:
{"scores":[{"criterion":"criterion text","score":3,"note":"brief note"}],"totalScore":15,"pattern":"One sentence pattern observation"}

Score each criterion 1-5. totalScore is the sum. pattern is a one-sentence observation about the team's approach.`;

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a scoring system. Respond ONLY with valid JSON, no markdown, no explanation.',
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 512,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
      const text = textBlock?.text || '';
      // Try to parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as PitStopResult;
        setScores(parsed.scores);
        setTotalScore(parsed.totalScore);
        setPattern(parsed.pattern);
        // Notify parent immediately so facilitator dashboard sees scores
        onScoresReady?.(parsed);
      } else {
        throw new Error('Could not parse scoring response.');
      }
    } catch (err) {
      setError(String(err));
      // Fallback scores
      const fallback: CriterionScore[] = scenario.assessmentCriteria.map((c) => ({
        criterion: c,
        score: 3,
        note: 'Score pending — API response could not be parsed.',
      }));
      const fallbackResult: PitStopResult = {
        scores: fallback,
        totalScore: fallback.length * 3,
        pattern: 'Assessment in progress.',
      };
      setScores(fallbackResult.scores);
      setTotalScore(fallbackResult.totalScore);
      setPattern(fallbackResult.pattern);
      // Notify parent with fallback so facilitator still sees something
      onScoresReady?.(fallbackResult);
    }
    setLoading(false);
    setTimerActive(true);
  }, [scenario, messages, onScoresReady]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  function handleResume() {
    if (!scores) return;
    onComplete({ scores, totalScore, pattern });
  }

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Pit Stop
          </h1>
          <span
            className="text-2xl font-semibold"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: timerSeconds <= 30 ? 'var(--accent-alert)' : 'var(--text-secondary)' }}
          >
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Generating assessment...</p>
        ) : (
          <>
            {error && (
              <p className="mb-4 text-sm" style={{ color: 'var(--accent-alert)', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
            )}

            {/* Scores */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                Interim Scores
              </h2>
              <div className="space-y-3">
                {scores?.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-start justify-between"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
                        {s.criterion}
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                        {s.note}
                      </p>
                    </div>
                    <span
                      className="text-lg font-semibold shrink-0"
                      style={{
                        color: s.score >= 4 ? 'var(--accent-primary)' : s.score <= 2 ? 'var(--accent-alert)' : 'var(--accent-secondary)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s.score}/5
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <span className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>Total: </span>
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {totalScore}/{(scores?.length || 5) * 5}
                </span>
              </div>
              {pattern && (
                <p className="mt-3 text-sm italic" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                  {pattern}
                </p>
              )}
            </div>

            {/* Pit Stop Questions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                Discussion Questions
              </h2>
              <ul className="space-y-2">
                {scenario.pitStopQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="p-3 text-sm"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
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

            {/* Reflection Prompt */}
            <div
              className="p-8 mb-8 text-center"
              style={{ background: 'var(--bg-tertiary)', borderRadius: '12px' }}
            >
              <p className="text-xl font-medium" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {scenario.reflectionPrompt}
              </p>
            </div>

            <button
              onClick={handleResume}
              className="px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'var(--accent-primary)',
                color: '#fff',
                borderRadius: '8px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Resume Simulation
            </button>
          </>
        )}
      </div>
    </div>
  );
}
