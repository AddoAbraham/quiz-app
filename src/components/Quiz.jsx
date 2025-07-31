import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import he from "he";

const playSound = (src) => {
  const sound = new Audio(src);
  sound.play().catch((err) => console.warn("Sound play failed:", err));
};

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Quiz = ({ restartQuiz }) => {
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
  const [error, setError] = useState(null);

  const amount = 10;
  const category = "";
  const difficulty = "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;
        if (category) apiUrl += `&category=${category}`;
        if (difficulty) apiUrl += `&difficulty=${difficulty}`;
        apiUrl += `&type=multiple`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.response_code !== 0 || !data.results.length) {
          setError("No questions found.");
          setLoading(false);
          return;
        }

        const formattedQuestions = data.results.map((q) => ({
          question: q.question,
          correct: q.correct_answer,
          answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));

        setQuestions(formattedQuestions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selected || reviewMode || loading || error) return;
    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleAnswer(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [selected, reviewMode, loading, error, timeLeft]);

  const handleAnswer = (answer) => {
    if (!questions[index] || selected !== null) return;

    const current = questions[index];
    const isCorrect = answer === current.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSound("/sounds/correct.mp3");
    } else {
      playSound("/sounds/wrong.mp3");
    }

    setAnswerHistory((prev) => [
      ...prev,
      {
        question: current.question,
        correct: current.correct,
        selected: answer,
        answers: current.answers,
      },
    ]);
    setSelected(answer);

    setTimeout(() => {
      setSelected(null);
      setTimeLeft(15);
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
      } else {
        setReviewMode(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore > highScore) {
          setHighScore(finalScore);
          setNewHighScore(true);
          localStorage.setItem("highScore", JSON.stringify(finalScore));
        }
        playSound("/sounds/completed.mp3");
      }
    }, 1000);
  };

  const handleRestart = () => restartQuiz();

  if (loading) return <p className="text-center text-lg">Loading quiz...</p>;

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={handleRestart}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviewMode) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Finished!</h2>
        <p className="text-center mb-4">
          Score:{" "}
          <strong>
            {score} / {questions.length}
          </strong>
        </p>
        {newHighScore && (
          <p className="text-green-600 text-center font-semibold mb-4">
            🎉 New High Score!
          </p>
        )}
        <ul className="space-y-4">
          {answerHistory.map((item, i) => (
            <li key={i} className="border p-4 rounded">
              <div className="font-semibold mb-2">
                Q{i + 1}: {he.decode(item.question)}
              </div>
              {item.answers.map((a, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded ${
                    a === item.correct
                      ? "bg-green-200"
                      : a === item.selected
                      ? "bg-red-200"
                      : ""
                  }`}
                >
                  {he.decode(a)}
                </div>
              ))}
            </li>
          ))}
        </ul>
        <div className="text-center mt-6">
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span className="text-red-600 font-bold">Time Left: {timeLeft}s</span>
      </div>
      <h2 className="text-lg font-semibold mb-4">
        {he.decode(current.question)}
      </h2>
      <div className="space-y-2">
        {current.answers.map((a, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(a)}
            className={`block w-full text-left px-4 py-2 border rounded ${
              selected === a
                ? a === current.correct
                  ? "bg-green-200"
                  : "bg-red-200"
                : "hover:bg-gray-100"
            }`}
            disabled={selected !== null}
          >
            {he.decode(a)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
