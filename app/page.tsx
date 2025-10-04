"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { questions } from "./data/questions";

export default function QuizPage() {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (showResult || !submitted) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, submitted]);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[current].answer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => handleNext(), 1200);
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
    setSubmitted(false);
    setUsername("");
  };

  const progress = ((current + 1) / questions.length) * 100;
  const q = questions[current];

  const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <Image
        src="/bg.jpg"
        alt="Background"
        fill
        priority
        className="object-cover blur-sm pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );

  if (!submitted) {
    return (
      <BackgroundWrapper>
        <Image
          src="/rialo-logo.png"
          alt="Rialo Logo"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-3xl font-extrabold mb-6">Rialo Knowledge Game</h1>
        <p className="mb-4 text-lg">Enter your username to start:</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name..."
          className="px-4 py-2 rounded-lg text-black mb-4 w-64 text-center"
        />
        <button
          onClick={() => username.trim() && setSubmitted(true)}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Start Quiz 🚀
        </button>
      </BackgroundWrapper>
    );
  }

  if (showResult) {
    return (
      <BackgroundWrapper>
        <Image
          src="/rialo-logo.png"
          alt="Rialo Logo"
          width={80}
          height={80}
          className="mb-4"
        />
        <h1 className="text-3xl font-extrabold mb-2">Rialo Knowledge Game 🎉</h1>
        <p className="text-lg mb-2">
          Player: <span className="font-bold">{username}</span>
        </p>
        <p className="text-lg mb-6">
          Your Score: {score} / {questions.length}
        </p>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Restart Game 🔄
        </button>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <Image
        src="/rialo-logo.png"
        alt="Rialo Logo"
        width={80}
        height={80}
        className="mb-3"
      />
      <h1 className="text-3xl font-extrabold mb-6">Rialo Knowledge Game</h1>

      <div className="w-full max-w-lg mb-6">
        <div className="w-full h-3 bg-gray-700 rounded-full">
          <div
            className="h-3 bg-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-300 mt-1 text-center">
          Question {current + 1} of {questions.length}
        </p>
      </div>

      <p className="mb-6 text-center text-lg">{q.question}</p>

      <div className="grid grid-cols-1 gap-3 w-full max-w-lg">
        {q.options.map((opt, idx) => {
          let className =
            "p-3 border rounded-lg cursor-pointer transition-colors";
          if (selected !== null) {
            if (idx === q.answer) {
              className += " bg-green-400 border-green-700 text-black";
            } else if (idx === selected && selected !== q.answer) {
              className += " bg-red-400 border-red-700 text-black";
            } else {
              className += " bg-gray-600 border-gray-500";
            }
          } else {
            className += " bg-white text-black hover:bg-yellow-200";
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
    </BackgroundWrapper>
  );
}
