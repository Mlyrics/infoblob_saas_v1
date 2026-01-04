// app/dashboard/Sparkline.tsx
'use client';

import { LineChart, Line } from 'recharts';

interface SparklineProps {
  data: { date: string; value: number }[];
  stroke?: string;
}

export default function Sparkline({ data, stroke = '#a855f7' }: SparklineProps) {
  return (
    <LineChart width={80} height={40} data={data}>
      <Line
        type="monotone"
        dataKey="value"
        stroke={stroke}
        strokeWidth={1.5}
        dot={false}
      />
    </LineChart>
  );
}
