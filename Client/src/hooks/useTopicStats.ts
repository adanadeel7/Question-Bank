import { useEffect, useState } from "react";
import { getMyStatsRequest, getQuestionsRequest } from "../lib/api";
import { TOPIC_OPTIONS } from "../lib/topics";

export interface TopicRow {
  name: string;
  value: string;
  attempted: number;
  total: number;
  marksScored: number;
  marksPossible: number;
  mastery: number;
}

export function useTopicStats() {
  const [rows, setRows] = useState<TopicRow[] | null>(null);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [totalMarksScored, setTotalMarksScored] = useState(0);
  const [totalMarksPossible, setTotalMarksPossible] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      getMyStatsRequest(),
      Promise.all(TOPIC_OPTIONS.map((t) => getQuestionsRequest({ topics: [t.value] }))),
    ])
      .then(([statsRes, bankResults]) => {
        if (cancelled) return;
        const merged: TopicRow[] = TOPIC_OPTIONS.map((t, i) => {
          const s = statsRes.stats.topics[t.value] ?? { attempted: 0, marksScored: 0, marksPossible: 0 };
          return {
            name: t.label,
            value: t.value,
            attempted: s.attempted,
            total: bankResults[i].questions.length,
            marksScored: s.marksScored,
            marksPossible: s.marksPossible,
            mastery: s.marksPossible > 0 ? Math.round((s.marksScored / s.marksPossible) * 100) : 0,
          };
        });
        setRows(merged);
        setTotalAttempted(statsRes.stats.totalAttempted);
        setTotalMarksScored(statsRes.stats.totalMarksScored);
        setTotalMarksPossible(statsRes.stats.totalMarksPossible);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your stats");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, totalAttempted, totalMarksScored, totalMarksPossible, loading, error };
}
