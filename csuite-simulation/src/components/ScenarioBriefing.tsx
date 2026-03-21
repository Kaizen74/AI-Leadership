'use client';

import { Scenario } from '@/lib/types';

interface Props {
  scenario: Scenario;
  onLaunch: () => void;
}

export default function ScenarioBriefing({ scenario, onLaunch }: Props) {
  return (
    <div className="max-w-[960px] mx-auto px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(27,107,90,0.08)', color: 'var(--accent-primary)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {scenario.difficulty}
          </span>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(59,90,155,0.08)', color: 'var(--accent-info)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {scenario.track}
          </span>
          <span style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
            {scenario.duration}
          </span>
        </div>
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          {scenario.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '16px', lineHeight: '1.6' }}>
          {scenario.description}
        </p>
      </div>

      <div
        className="p-6 mb-8"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Scenario Context
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', lineHeight: '1.7' }}>
          {scenario.context}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Characters
        </h2>
        <div className="grid gap-3">
          {scenario.characters.map((c) => (
            <div
              key={c.name}
              className="p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: c.type === 'agent' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {c.name}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: c.type === 'agent' ? 'rgba(27,107,90,0.08)' : 'rgba(196,152,90,0.08)',
                    color: c.type === 'agent' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {c.type === 'agent' ? 'AI System' : 'Human'}
                </span>
              </div>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>
                {c.role}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5' }}>
                {c.personality}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Assessment Criteria
        </h2>
        <ul className="space-y-2">
          {scenario.assessmentCriteria.map((c, i) => (
            <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5' }}>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onLaunch}
        className="px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
        style={{
          background: 'var(--accent-primary)',
          color: '#fff',
          borderRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Launch Simulation
      </button>
    </div>
  );
}
