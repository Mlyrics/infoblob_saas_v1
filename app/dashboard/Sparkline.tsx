// app/dashboard/Sparkline.tsx
'use client';

interface SparklineProps {
  data: { date: string; value: number }[];
  stroke?: string;
}

/**
 * A lightweight sparkline component that uses pure SVG.
 * The parent component should control width/height via CSS.
 */
export default function Sparkline({ data, stroke = '#a855f7' }: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <svg width={80} height={40} viewBox="0 0 100 100">
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke={stroke}
          strokeWidth="2"
        />
      </svg>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / maxVal) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={80} height={40} viewBox="0 0 100 100">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
      />
    </svg>
  );
}
