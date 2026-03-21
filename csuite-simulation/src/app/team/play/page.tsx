'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { scenarios } from '@/lib/scenarios';
import { buildSystemPrompt } from '@/lib/prompts';
import { Message, Scenario, PitStopResult } from '@/lib/types';
import ScenarioBriefing from '@/components/ScenarioBriefing';
import ChatMessage from '@/components/ChatMessage';
import PitStop from '@/components/PitStop';
import Assessment from '@/components/Assessment';

function PlayContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const teamName = searchParams.get('team') || '';
  const scenarioId = searchParams.get('scenario') || '';

  const scenario = scenarios.find((s) => s.id === scenarioId) as Scenario | undefined;

  const [phase, setPhase] = useState<'briefing' | 'playing' | 'pitstop' | 'completed'>('briefing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState(0);
  const [pitStopResults, setPitStopResults] = useState<PitStopResult[]>([]);
  const [finalAssessment, setFinalAssessment] = useState<string | null>(null);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const updateServer = useCallback(
    async (updates: Record<string, unknown>) => {
      try {
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updateTeam', code, teamName, ...updates }),
        });
      } catch {
        // Non-critical — facilitator polling will still work
      }
    },
    [code, teamName]
  );

  async function callSimulation(msgs: Message[]): Promise<string> {
    if (!scenario) return '';
    const systemPrompt = buildSystemPrompt(scenario);
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt, messages: msgs, maxTokens: 1024 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
    return textBlock?.text || 'No response received.';
  }

  async function handleLaunch() {
    setPhase('playing');
    setLoading(true);
    setError('');
    updateServer({ status: 'playing' });
    try {
      // Get opening message
      const openingMessages: Message[] = [{ role: 'user', content: 'Begin the simulation. Set the scene and have the first character speak.' }];
      const response = await callSimulation(openingMessages);
      setMessages([{ role: 'assistant', content: response }]);
      setTurn(1);
      updateServer({ turn: 1, messages: [{ role: 'assistant', content: response }] });
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    const newTurn = turn + 1;
    setTurn(newTurn);

    try {
      const response = await callSimulation(newMessages);
      const assistantMsg: Message = { role: 'assistant', content: response };
      const updatedMessages = [...newMessages, assistantMsg];
      setMessages(updatedMessages);
      updateServer({ turn: newTurn, messages: updatedMessages, status: 'playing' });

      // Check for pit stop at every 4th user turn
      if (newTurn > 0 && newTurn % 4 === 0) {
        setPhase('pitstop');
        updateServer({ status: 'pitstop' });
      }
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  function handlePitStopComplete(result: PitStopResult) {
    const newResults = [...pitStopResults, result];
    setPitStopResults(newResults);
    setPhase('playing');
    updateServer({ status: 'playing', pitStopResult: result });
  }

  async function handleEndAndAssess() {
    if (!scenario) return;
    setLoading(true);
    setError('');
    try {
      const assessmentPrompt = `You have been observing this leadership simulation. Now provide a comprehensive debrief assessment.

SCENARIO: ${scenario.name}
ASSESSMENT CRITERIA:
${scenario.assessmentCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

CONVERSATION TRANSCRIPT:
${messages.map((m) => `${m.role === 'user' ? 'LEADER' : 'SIMULATION'}: ${m.content}`).join('\n\n')}

Provide a detailed narrative assessment (500-800 words) that:
1. Scores each criterion 1-5 with specific evidence from the conversation
2. Identifies the leader's strongest moments and missed opportunities
3. Highlights patterns in their decision-making approach
4. Offers 2-3 specific suggestions for development
5. Ends with the reflection prompt: "${scenario.reflectionPrompt}"

Format the scores at the top as a clear list, then provide the narrative.`;

      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are an expert executive leadership assessor. Provide frank, evidence-based feedback appropriate for C-suite leaders.',
          messages: [{ role: 'user', content: assessmentPrompt }],
          maxTokens: 2048,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
      const assessment = textBlock?.text || 'Assessment could not be generated.';
      setFinalAssessment(assessment);
      setPhase('completed');
      updateServer({ status: 'completed', finalAssessment: assessment });
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>Scenario not found.</p>
      </div>
    );
  }

  if (phase === 'briefing') {
    return <ScenarioBriefing scenario={scenario} onLaunch={handleLaunch} />;
  }

  if (phase === 'pitstop') {
    return <PitStop scenario={scenario} messages={messages} onComplete={handlePitStopComplete} />;
  }

  if (phase === 'completed' && finalAssessment) {
    return <Assessment scenario={scenario} assessment={finalAssessment} pitStopResults={pitStopResults} />;
  }

  // Playing phase
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--surface-dark)', color: 'var(--text-on-dark)' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {scenario.name}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            {teamName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ background: 'rgba(27,107,90,0.15)', color: '#6ee7b7', fontFamily: "'JetBrains Mono', monospace" }}
          >
            Turn {turn}
          </span>
          <button
            onClick={handleEndAndAssess}
            disabled={turn < 4 || loading}
            className="text-sm px-4 py-2 font-medium transition-opacity hover:opacity-90 disabled:opacity-30"
            style={{
              background: 'var(--accent-secondary)',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            End & Request Assessment
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} scenario={scenario} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div
                  className="px-5 py-3 text-sm"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}
                >
                  <span className="inline-flex gap-1" style={{ color: 'var(--text-tertiary)' }}>
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 text-sm" style={{ background: 'rgba(155,59,59,0.08)', color: 'var(--accent-alert)', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif" }}>
                {error}
                <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border-light)' }}>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response as the leader..."
                disabled={loading}
                className="flex-1 px-4 py-3 outline-none"
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
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Character sidebar */}
        <aside
          className="w-64 overflow-y-auto px-4 py-6 hidden md:block"
          style={{ borderLeft: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Characters
          </h3>
          {scenario.characters.map((c) => (
            <div key={c.name} className="mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: c.type === 'agent' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {c.name}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: c.type === 'agent' ? 'rgba(27,107,90,0.08)' : 'rgba(196,152,90,0.08)',
                    color: c.type === 'agent' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {c.type === 'agent' ? 'AI' : 'Human'}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                {c.role}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>}>
      <PlayContent />
    </Suspense>
  );
}
