"use client";

import { useEffect, useState, useCallback } from "react";
import {
  farmersEdgeVerticals,
  verticalContent,
  type VerticalContent,
} from "@/data/farmersEdge";

export type VerticalMeta = {
  id: string;
  label: string;
  emoji: string;
  sub: string;
};

type VerticalsResult = {
  verticals: VerticalMeta[];
  source: string;
};

type ContentResult = {
  content: VerticalContent;
  source: string;
  vertical: string;
};

type FarmersEdgeState = {
  verticals: VerticalMeta[];
  content: VerticalContent | null;
  verticalsLoading: boolean;
  contentLoading: boolean;
  verticalsSource: string;
  contentSource: string;
  refetchContent: () => void;
};

export function useFarmersEdgeData(activeVertical: string): FarmersEdgeState {
  const [verticals, setVerticals] = useState<VerticalMeta[]>(farmersEdgeVerticals);
  const [verticalsLoading, setVerticalsLoading] = useState(false);
  const [verticalsSource, setVerticalsSource] = useState("static");

  const [content, setContent] = useState<VerticalContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSource, setContentSource] = useState("static");

  // Load vertical list once on mount
  useEffect(() => {
    let cancelled = false;
    setVerticalsLoading(true);

    fetch("/api/sheets/verticals")
      .then((r) => r.json())
      .then((data: VerticalsResult) => {
        if (cancelled) return;
        setVerticals(data.verticals);
        setVerticalsSource(data.source);
      })
      .catch(() => {
        if (cancelled) return;
        // Keep static fallback
      })
      .finally(() => {
        if (!cancelled) setVerticalsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const fetchContent = useCallback(() => {
    let cancelled = false;
    setContentLoading(true);

    fetch(`/api/sheets/farmers-edge?vertical=${encodeURIComponent(activeVertical)}`)
      .then((r) => r.json())
      .then((data: ContentResult) => {
        if (cancelled) return;
        setContent(data.content);
        setContentSource(data.source);
      })
      .catch(() => {
        if (cancelled) return;
        // Static fallback
        setContent(verticalContent[activeVertical] ?? verticalContent.all);
        setContentSource("static");
      })
      .finally(() => {
        if (!cancelled) setContentLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeVertical]);

  useEffect(() => {
    const cancel = fetchContent();
    return cancel;
  }, [fetchContent]);

  return {
    verticals,
    content,
    verticalsLoading,
    contentLoading,
    verticalsSource,
    contentSource,
    refetchContent: fetchContent,
  };
}
