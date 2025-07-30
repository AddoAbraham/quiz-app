import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import he from "he";

const playSound = (src) => {
  const sound = new Audio(src);
  sound.play();
};

const Quiz = ({ settings, restartQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [reviewMode, setReviewMode] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("highScore");
    return saved ? JSON.parse(saved) : 0;
  });
  const [newHighScore, setNewHighScore] = useState(false);

  const { amount, category, difficulty } = settings;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
      if (category) url += `&category=${category}`;
      if (difficulty) url += `&difficulty=${difficulty}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [amount, category, difficulty]);

  useEffect(() => {
    if (selected || index === -1) return;
    if (timeLeft === 0) {
      playSound("/sounds/timeout.mp3");
      handleAnswer(null);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selected, index]);

  useEffect(() => {
    if (index === -1 && questions.length > 0) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", JSON.stringify(score));
        setNewHighScore(true);
      }
      playSound("/sounds/completed.mp3");
    }
  }, [index, score, highScore, questions.length]);

  const current = questions[index];
  const allAnswers = current
    ? [...current.incorrect_answers, current.correct_answer].sort(
        () => Math.random() - 0.5
      )
    : [];

  const handleAnswer = (answer) => {
    setSelected(answer);
    const isCorrect = answer === current?.correct_answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSound("/sounds/correct.mp3");
    } else if (answer !== null) {
      playSound("/sounds/wrong.mp3");
    }

    setAnswerHistory((prev) => [
      ...prev,
      {
        question: current?.question,
        selected: answer,
        correct: current?.correct_answer,
      },
    ]);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((prev) => prev + 1);
        setSelected(null);
        setTimeLeft(15);
      } else {
        setIndex(-1);
      }
    }, 1000);
  };

  const showReview = () => setReviewMode(true);

  if (loading)
    return <p className="text-center text-lg">Loading questions...</p>;

  if (reviewMode) {
    return (
      <motion.div
        className="max-w-2xl mx-auto space-y-4 p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center">Review Your Answers</h2>
        {answerHistory.map((entry, i) => (
          <div key={i} className="border p-4 rounded bg-white shadow">
            <p className="font-semibold">{he.decode(entry.question)}</p>
            <p className="mt-2">
              <span className="font-medium">Your Answer:</span>{" "}
              <span
                className={
                  entry.selected === entry.correct
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {entry.selected ? he.decode(entry.selected) : "No answer"}
              </span>
            </p>
            {entry.selected !== entry.correct && (
              <p>
                <span className="font-medium">Correct Answer:</span>{" "}
                <span className="text-green-700">
                  {he.decode(entry.correct)}
                </span>
              </p>
            )}
          </div>
        ))}
        <div className="text-center">
          <button
            onClick={restartQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Restart Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  if (index === -1) {
    return (
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-green-600">Quiz Complete!</h2>
        <p className="text-lg">
          You scored <strong>{score}</strong> out of{" "}
          <strong>{questions.length}</strong>
        </p>
        {newHighScore ? (
          <p className="text-green-600 font-semibold text-lg">
            🎉 New High Score!
          </p>
        ) : (
          <p className="text-gray-600">
            Best Score: <strong>{highScore}</strong>
          </p>
        )}
        <div className="space-x-3">
          <button
            onClick={restartQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Restart Quiz
          </button>
          <button
            onClick={showReview}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Review Answers
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-xl mx-auto p-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Question {index + 1} of {questions.length}
          </h2>
          <p className="text-sm text-gray-600 font-semibold">Score: {score}</p>
        </div>

        <p className="text-lg font-medium">{he.decode(current.question)}</p>

        <div className="text-right text-sm text-red-500 font-semibold">
          Time Left: <span>{timeLeft}s</span>
        </div>

        <div className="grid gap-3">
          {allAnswers.map((answer, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAnswer(answer)}
              disabled={selected}
              className={`p-3 rounded border transition-all duration-200 ${
                selected
                  ? answer === current.correct_answer
                    ? "bg-green-500 text-white"
                    : answer === selected
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              {he.decode(answer)}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Quiz;
