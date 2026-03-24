'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { scenarios } from '@/lib/scenarios';
import IndustrySelector from '@/components/IndustrySelector';

export default function SoloSetup() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState('aviation_logistics');
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);

  const difficultyOrder = { Foundation: 0, Intermediate: 1, Advanced: 2, Expert: 3 };

  function handleStart() {
    const params = new URLSearchParams({
      scenario: selectedScenario,
      industry: selectedIndustry,
    });
    router.push(`/solo/play?${params.toString()}`);
  }

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[960px] mx-auto">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
          Solo Practice
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>
          Practice leadership simulations individually. No session code needed — choose your industry and scenario to begin.
        </p>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Industry Context
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
            Choose an industry to recontextualize the scenario.
          </p>
          <IndustrySelector selected={selectedIndustry} onSelect={setSelectedIndustry} />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
            Select Scenario
          </h2>
          <div className="space-y-3">
            {[...scenarios]
              .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  className="w-full text-left p-5 transition-all"
                  style={{
                    background: selectedScenario === s.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: `1px solid ${selectedScenario === s.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                    borderRadius: '12px',
                    boxShadow: selectedScenario === s.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)', fontSize: '16px' }}>
                      {s.name}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(27,107,90,0.08)', color: 'var(--accent-primary)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {s.difficulty}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(59,90,155,0.08)', color: 'var(--accent-info)', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {s.track}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif" }}>
                      {s.duration}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.5' }}>
                    {s.description}
                  </p>
                </button>
              ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
          style={{
            background: 'var(--accent-primary)',
            color: '#fff',
            borderRadius: '8px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Start Solo Simulation
        </button>
      </div>
    </div>
  );
}
