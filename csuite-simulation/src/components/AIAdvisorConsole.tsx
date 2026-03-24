'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Scenario } from '@/lib/types';
import { Industry } from '@/lib/industries';
import { buildAdvisorPrompt } from '@/lib/prompts';

interface Props {
  scenario: Scenario;
  simulationMessages: Message[];
  industry?: Industry;
}

interface AdvisorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAdvisorConsole({ scenario, simulationMessages, industry }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: AdvisorMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = buildAdvisorPrompt(scenario, industry);
      const simulationContext = simulationMessages
        .map((m) => `${m.role === 'user' ? 'LEADER' : 'SIMULATION'}: ${m.content}`)
        .join('\n\n');

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: systemPrompt,
          messages: newMessages,
          simulationContext,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
      const response = textBlock?.text || 'No response received.';
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Advisor temporarily unavailable. Try again.' }]);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 z-50"
        style={{
          background: 'var(--accent-info)',
          color: '#fff',
          borderRadius: '12px',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        AI Advisor
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-96 flex flex-col z-50"
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        maxHeight: '500px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)', borderRadius: '16px 16px 0 0' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--accent-info)', fontFamily: "'DM Sans', sans-serif" }}>
            AI Advisor
          </p>
          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            Ask for coaching — does not affect simulation
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-sm px-2 py-1"
          style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ minHeight: '200px', maxHeight: '350px' }}>
        {messages.length === 0 && (
          <p className="text-xs text-center mt-8" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            Ask the AI Advisor for perspective on your approach, stakeholder dynamics, or framing strategy.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
              className="max-w-[85%] px-3 py-2 text-xs"
              style={{
                background: m.role === 'user' ? 'rgba(59,90,155,0.08)' : 'var(--bg-secondary)',
                border: `1px solid ${m.role === 'user' ? 'rgba(59,90,155,0.15)' : 'var(--border-light)'}`,
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: '1.5',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div
              className="px-3 py-2 text-xs"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '10px' }}
            >
              <span className="inline-flex gap-1" style={{ color: 'var(--text-tertiary)' }}>
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2" style={{ borderTop: '1px solid var(--border-light)' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the advisor..."
            disabled={loading}
            className="flex-1 px-3 py-2 text-xs outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{
              background: 'var(--accent-info)',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
