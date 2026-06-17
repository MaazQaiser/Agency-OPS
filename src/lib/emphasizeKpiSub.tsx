import type { ReactNode } from "react";

type Span = { start: number; end: number };

const EMPHASIS_PATTERNS: RegExp[] = [
  /^(Producer|Retention|Commercial|Prime Agency)/,
  /\$[\d,]+(?:\/\w+)?/g,
  /\d+(?:\.\d+)?%\+?/g,
  /\d+\+\/[\w]+/g,
  /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d+(?:,\s*\d{4})?(?:[–—-][A-Za-z]+ \d+)?/g,
  /\(Tier \d+\)/g,
  /\b(?:Target|Need|Goal|Folio period)\b/g,
];

function collectSpans(text: string): Span[] {
  const spans: Span[] = [];

  for (const pattern of EMPHASIS_PATTERNS) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const regex = new RegExp(pattern.source, flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      spans.push({ start: match.index, end: match.index + match[0].length });
    }
  }

  return spans.sort((a, b) => a.start - b.start || a.end - b.end);
}

function mergeSpans(spans: Span[]): Span[] {
  const merged: Span[] = [];

  for (const span of spans) {
    const last = merged[merged.length - 1];
    if (!last || span.start > last.end) {
      merged.push({ ...span });
      continue;
    }
    last.end = Math.max(last.end, span.end);
  }

  return merged;
}

export function emphasizeKpiSub(text: string): ReactNode {
  const spans = mergeSpans(collectSpans(text));
  if (spans.length === 0) return text;

  const parts: ReactNode[] = [];
  let cursor = 0;

  spans.forEach((span, index) => {
    if (span.start > cursor) {
      parts.push(text.slice(cursor, span.start));
    }
    parts.push(
      <strong key={index} className="kpi-sub-em">
        {text.slice(span.start, span.end)}
      </strong>,
    );
    cursor = span.end;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}
