"use client";

import { useEffect, useState } from "react";

type DepartmentProgressRingProps = {
  completion: number;
  size?: number;
  label?: string;
};

/**
 * Training Hub Signature Element: Circular progress ring per department
 * Ring stroke uses --hub-primary via CSS. Track uses --hub-glow.
 */
export function DepartmentProgressRing({ completion, size = 56, label }: DepartmentProgressRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? completion / 100 : 0) * circumference;

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
    return () => cancelAnimationFrame(t);
  }, [completion]);

  return (
    <div className="dept-progress-ring" style={{ width: size, height: size }} role="img" aria-label={label ? `${label}: ${completion}% complete` : `${completion}% complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="4"
          className="dept-progress-ring-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="dept-progress-ring-fill"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="dept-progress-ring-value">{completion}%</span>
    </div>
  );
}
