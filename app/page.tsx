"use client";

import { useState, useEffect } from "react";
import { questions } from "./data/questions";

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // timer per soal

  useEffect(() => {
    if (showResult) return; // stop timer kalau sudah selesai
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleAnswer = (index: number) => {
    if (selected !== null) return; // biar gak bisa pilih lebih dari sekali
    setSelected(index);
    if (index === questions[current].answer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => handleNext(), 1200); // delay sebelum lanjut
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setTimeLeft(15);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(15);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Quiz Finished 🎉</h1>
        <p className="text-lg mb-6">
          Your Score: {score} / {questions.length}
        </p>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Restart Quiz 🔄
        </button>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-6">
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1 text-center">
          Question {current + 1} of {questions.length}
        </p>
      </div>

      <p className="mb-6 text-center font-medium">{q.question}</p>

      <div className="grid grid-cols-1 gap-3 w-full max-w-lg">
        {q.options.map((opt, idx) => {
          let className =
            "p-3 border rounded-lg cursor-pointer transition-colors";
          if (selected !== null) {
            if (idx === q.answer) {
              className += " bg-green-300 border-green-500";
            } else if (idx === selected && selected !== q.answer) {
              className += " bg-red-300 border-red-500";
            } else {
              className += " bg-gray-100";
            }
          } else {
            className += " hover:bg-blue-100";
          }
          return (
            <button
              key={idx}
              className={className}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-lg font-bold">⏳ {timeLeft}s</div>
    </div>
  );
}
