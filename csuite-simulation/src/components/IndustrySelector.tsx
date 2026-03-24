'use client';

import { industries } from '@/lib/industries';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function IndustrySelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {industries.map((ind) => (
        <button
          key={ind.id}
          onClick={() => onSelect(ind.id)}
          className="p-4 text-left transition-all"
          style={{
            background: selected === ind.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
            border: `1px solid ${selected === ind.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
            borderRadius: '12px',
            boxShadow: selected === ind.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          }}
        >
          <div className="text-2xl mb-2">{ind.icon}</div>
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {ind.name}
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--text-tertiary)', fontFamily: "'DM Sans', sans-serif", lineHeight: '1.4' }}
          >
            {ind.description}
          </p>
        </button>
      ))}
    </div>
  );
}
