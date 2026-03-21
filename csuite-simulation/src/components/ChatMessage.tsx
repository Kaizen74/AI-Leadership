'use client';

import { Message, Scenario } from '@/lib/types';

interface Props {
  message: Message;
  scenario: Scenario;
}

function renderContent(text: string, scenario: Scenario) {
  const humanNames = scenario.characters.filter((c) => c.type === 'human').map((c) => c.name);
  const agentNames = scenario.characters.filter((c) => c.type === 'agent').map((c) => c.name);

  // Split by bold character names (**Name:**) and italic stage directions (*text*)
  const parts: { type: 'text' | 'human' | 'agent' | 'stage'; content: string }[] = [];
  // Match **CharName:** or *stage direction*
  const regex = /(\*\*([^*]+?):\*\*)|(\*([^*]+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      // Bold character name
      const name = match[2];
      const isAgent = agentNames.some((a) => name.includes(a));
      const isHuman = humanNames.some((h) => name.includes(h));
      parts.push({ type: isAgent ? 'agent' : isHuman ? 'human' : 'text', content: `${name}:` });
    } else if (match[3]) {
      // Italic stage direction
      parts.push({ type: 'stage', content: match[4] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.map((p, i) => {
    if (p.type === 'human') {
      return (
        <span key={i} className="font-semibold" style={{ color: 'var(--accent-secondary)' }}>
          {p.content}
        </span>
      );
    }
    if (p.type === 'agent') {
      return (
        <span key={i} className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
          {p.content}
        </span>
      );
    }
    if (p.type === 'stage') {
      return (
        <em key={i} style={{ color: 'var(--text-tertiary)' }}>
          {p.content}
        </em>
      );
    }
    return <span key={i}>{p.content}</span>;
  });
}

export default function ChatMessage({ message, scenario }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className="max-w-[80%] px-5 py-3 text-sm whitespace-pre-wrap"
        style={{
          background: isUser ? 'rgba(27,107,90,0.08)' : 'var(--bg-secondary)',
          border: `1px solid ${isUser ? 'rgba(27,107,90,0.15)' : 'var(--border-light)'}`,
          borderRadius: '12px',
          color: 'var(--text-primary)',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: '1.6',
        }}
      >
        {isUser ? message.content : renderContent(message.content, scenario)}
      </div>
    </div>
  );
}
