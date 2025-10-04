"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    question: "Apa singkatan token utama di ekosistem Rialo?",
    options: ["RLO", "RIALO", "RLT", "RLD"],
    answer: "RLO",
  },
  {
    question: "Rialo terutama berfokus pada apa?",
    options: ["Gaming", "Blockchain Ecosystem", "Social Media", "Streaming"],
    answer: "Blockchain Ecosystem",
  },
  {
    question: "Siapa yang dapat berkontribusi di Rialo?",
    options: ["Hanya developer", "Hanya investor", "Komunitas secara luas", "Tidak ada"],
    answer: "Komunitas secara luas",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  // Timer countdown
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const handleAnswer = (option: string | null) => {
    if (selected) return;
    setSelected(option ?? "");

    if (option === questions[current].answer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setTimeLeft(15);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setTimeLeft(15);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          🎮 Rialo Quiz
        </h1>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={current}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Pertanyaan {current + 1} dari {questions.length}
                </p>
                <p className="font-semibold text-red-500">⏳ {timeLeft}s</p>
              </div>

              <h2 className="text-lg font-semibold mb-6">{questions[current].question}</h2>

              <div className="grid gap-3">
                {questions[current].options.map((opt, idx) => {
                  const isCorrect = selected && opt === questions[current].answer;
                  const isWrong =
                    selected && selected === opt && opt !== questions[current].answer;

                  return (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      disabled={!!selected}
                      className={`px-4 py-3 rounded-lg border text-left font-medium transition-colors
                        ${!selected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                        ${isCorrect ? "bg-green-500 text-white border-green-700" : ""}
                        ${isWrong ? "bg-red-500 text-white border-red-700" : ""}
                        ${selected && !isCorrect && !isWrong ? "bg-gray-200 text-gray-600" : ""}
                      `}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4">🎉 Quiz Selesai!</h2>
              <p className="text-lg mb-6">
                Skor kamu:{" "}
                <span className="font-extrabold text-blue-600">{score}</span> /{" "}
                {questions.length}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restart}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                Main Lagi 🔄
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
