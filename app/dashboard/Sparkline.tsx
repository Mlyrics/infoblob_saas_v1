// app/dashboard/Sparkline.tsx
'use client';

interface SparklineProps {
  data: { date: string; value: number }[];
  stroke?: string;
}

/**
 * A lightweight sparkline component that does not rely on external charting libraries.
 *
 * It renders an SVG polyline scaled to the width/height of the viewBox. The width/height
 * of the rendered chart can be controlled with CSS by setting `width` and `height`
 * on the surrounding container.
 *
 * Example:
 * <Sparkline data={[{ date: '2024-01-01', value: 1 }, ...]} />
 */
export default function Sparkline({ data, stroke = '#a855f7' }: SparklineProps) {
  // If there are fewer than two points, render a flat line.
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

  // Compute the maximum value to scale the Y coordinates.
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);

  // Convert data points into SVG coordinate pairs. X is evenly spaced across the width (0-100),
  // Y is inverted (because SVG origin is top-left) and scaled according to maxVal.
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
