"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";
import { scoreQuiz, type QuizQuestion } from "@/data/trainingDetail";

type TrainingQuizBlockProps = {
  questions: QuizQuestion[];
  onValidated?: (passed: boolean) => void;
};

export function TrainingQuizBlock({ questions: initialQuestions, onValidated }: TrainingQuizBlockProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(1);

  const result = useMemo(() => scoreQuiz(questions), [questions]);

  const selectAnswer = (questionId: string, optionId: string) => {
    if (submitted && result.passed) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, selectedOptionId: optionId } : q)),
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onValidated?.(result.passed);
  };

  const handleRetry = () => {
    setQuestions(initialQuestions.map((q) => ({ ...q, selectedOptionId: undefined })));
    setSubmitted(false);
    setAttempt((a) => a + 1);
  };

  const allAnswered = questions.every((q) => q.selectedOptionId);

  return (
    <div className="training-quiz-block">
      <div className="training-quiz-header">
        <div>
          <h4 className="training-quiz-title">Knowledge Validation</h4>
          <p className="training-quiz-sub">Pass with 80% or higher to validate completion.</p>
        </div>
        <div className="training-quiz-meta">
          <span className="training-quiz-attempt">Attempt {attempt}</span>
          {submitted && (
            <span className={cn("badge", result.passed ? "badge-green" : "badge-rose")}>
              {result.passed ? "Passed" : "Failed"}
            </span>
          )}
        </div>
      </div>

      <ul className="training-quiz-questions">
        {questions.map((q, index) => (
          <li key={q.id} className="training-quiz-question-card">
            <p className="training-quiz-question">
              <span className="training-quiz-number">{index + 1}</span>
              {q.question}
            </p>
            <div className="training-quiz-options">
              {q.options.map((opt) => {
                const selected = q.selectedOptionId === opt.id;
                const showResult = submitted;
                const isCorrect = opt.id === q.correctOptionId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={cn(
                      "training-quiz-option",
                      selected && "selected",
                      showResult && isCorrect && "correct",
                      showResult && selected && !isCorrect && "incorrect",
                    )}
                    onClick={() => selectAnswer(q.id, opt.id)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {submitted && (
        <div className="training-quiz-results">
          <div className="training-quiz-score-grid">
            <div>
              <span className="training-quiz-score-label">Score</span>
              <strong>{result.score}%</strong>
            </div>
            <div>
              <span className="training-quiz-score-label">Confidence</span>
              <strong>{result.confidence}%</strong>
            </div>
          </div>
          {!result.passed && (
            <button type="button" className="va-ops-role-action-btn training-quiz-retry" onClick={handleRetry}>
              <AppIcon name="refresh" size={15} strokeWidth={2} />
              Retry Quiz
            </button>
          )}
          {result.passed && (
            <p className="training-quiz-pass-msg">
              <AppIcon name="check" size={16} strokeWidth={2.5} />
              Completion validated — you may mark this training complete.
            </p>
          )}
        </div>
      )}

      {!submitted && (
        <button
          type="button"
          className="va-ops-role-action-btn training-quiz-submit"
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          Validate Answers
        </button>
      )}
    </div>
  );
}
