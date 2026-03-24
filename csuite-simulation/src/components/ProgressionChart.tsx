'use client';

interface TrendPoint {
  date: number;
  score: number;
}

interface RadarProps {
  data: Record<string, number>;
  maxValue?: number;
}

interface TrendProps {
  points: TrendPoint[];
}

export function RadarChart({ data, maxValue = 5 }: RadarProps) {
  const entries = Object.entries(data);
  if (entries.length < 3) return null;

  const cx = 150;
  const cy = 150;
  const radius = 110;
  const n = entries.length;

  function polarToCart(angle: number, r: number) {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const angleStep = 360 / n;

  // Grid rings
  const rings = [1, 2, 3, 4, 5];
  const gridPaths = rings.map((ring) => {
    const r = (ring / maxValue) * radius;
    const pts = Array.from({ length: n }, (_, i) => polarToCart(i * angleStep, r));
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
  });

  // Data polygon
  const dataPoints = entries.map(([, val], i) => {
    const r = (Math.min(val, maxValue) / maxValue) * radius;
    return polarToCart(i * angleStep, r);
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Labels
  const labels = entries.map(([key], i) => {
    const p = polarToCart(i * angleStep, radius + 20);
    return { text: key, x: p.x, y: p.y };
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridPaths.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="var(--border-light)"
          strokeWidth="0.5"
        />
      ))}
      {/* Axes */}
      {entries.map((_, i) => {
        const p = polarToCart(i * angleStep, radius);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--border-light)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Data area */}
      <polygon
        points={dataPath}
        fill="rgba(27,107,90,0.15)"
        stroke="var(--accent-primary)"
        strokeWidth="2"
      />
      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--accent-primary)" />
      ))}
      {/* Labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="var(--text-tertiary)"
          fontFamily="'DM Sans', sans-serif"
        >
          {l.text.length > 15 ? `${l.text.slice(0, 14)}...` : l.text}
        </text>
      ))}
    </svg>
  );
}

export function TrendChart({ points }: TrendProps) {
  if (points.length < 2) return null;

  const width = 400;
  const height = 150;
  const pad = 30;

  const minScore = 0;
  const maxScore = 5;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  const xScale = (i: number) => pad + (i / (points.length - 1)) * plotW;
  const yScale = (v: number) => pad + plotH - ((v - minScore) / (maxScore - minScore)) * plotH;

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.score)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Y axis labels */}
      {[1, 2, 3, 4, 5].map((v) => (
        <g key={v}>
          <line x1={pad} y1={yScale(v)} x2={width - pad} y2={yScale(v)} stroke="var(--border-light)" strokeWidth="0.5" />
          <text x={pad - 8} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="var(--text-tertiary)" fontFamily="'JetBrains Mono', monospace">
            {v}
          </text>
        </g>
      ))}
      {/* Trend line */}
      <path d={pathD} fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(p.score)} r="3" fill="var(--accent-primary)" />
      ))}
      {/* X axis labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={xScale(i)}
          y={height - 5}
          textAnchor="middle"
          fontSize="8"
          fill="var(--text-tertiary)"
          fontFamily="'DM Sans', sans-serif"
        >
          {new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </text>
      ))}
    </svg>
  );
}
