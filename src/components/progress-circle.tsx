
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  progress: number;
  className?: string;
}

const TOTAL_SEGMENTS = 20;

export function ProgressCircle({ progress, className }: ProgressCircleProps) {
  const segments = Array.from({ length: TOTAL_SEGMENTS }, (_, i) => {
    const angle = (i / TOTAL_SEGMENTS) * 360;
    const isFilled = i < progress;

    // Calculations for the segment path
    const startAngle = (i / TOTAL_SEGMENTS) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / TOTAL_SEGMENTS) * 2 * Math.PI - Math.PI / 2;
    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';
    
    const outerRadius = 150;
    const innerRadius = 120;

    const x1_outer = 160 + outerRadius * Math.cos(startAngle);
    const y1_outer = 160 + outerRadius * Math.sin(startAngle);
    const x2_outer = 160 + outerRadius * Math.cos(endAngle - 0.05); // Small gap
    const y2_outer = 160 + outerRadius * Math.sin(endAngle - 0.05);

    const x1_inner = 160 + innerRadius * Math.cos(startAngle);
    const y1_inner = 160 + innerRadius * Math.sin(startAngle);
    const x2_inner = 160 + innerRadius * Math.cos(endAngle - 0.05);
    const y2_inner = 160 + innerRadius * Math.sin(endAngle - 0.05);

    const d = [
      `M ${x1_inner} ${y1_inner}`,
      `L ${x1_outer} ${y1_outer}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2_outer} ${y2_outer}`,
      `L ${x2_inner} ${y2_inner}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1_inner} ${y1_inner}`,
      'Z'
    ].join(' ');

    return (
      <path
        key={i}
        d={d}
        className={cn(
          'transition-colors duration-200',
          isFilled ? 'fill-primary' : 'fill-muted/50'
        )}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 320 320"
      className={cn('w-96 h-96 opacity-50', className)}
    >
      {segments}
    </svg>
  );
}
