import { useEffect, useState } from "react";
import he from "he"; // handles decoding HTML entities

const Quiz = ({ settings, restartQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let url = `https://opentdb.com/api.php?amount=${settings.amount}&type=multiple`;
        if (settings.category) url += `&category=${settings.category}`;
        if (settings.difficulty) url += `&difficulty=${settings.difficulty}`;

        const res = await fetch(url);
        const data = await res.json();
        setQuestions(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuestions();
  }, [settings]);

  const current = questions[index];
  if (loading) return <p className="text-center">Loading questions...</p>;

  const allAnswers = [
    ...current.incorrect_answers,
    current.correct_answer,
  ].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer) => {
    setSelected(answer);
    if (answer === current.correct_answer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
        setSelected(null);
      } else {
        setIndex(-1); // show final score
      }
    }, 1000);
  };

  if (index === -1) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-600">Quiz Complete!</h2>
        <p className="text-lg">
          You scored {score} out of {questions.length}
        </p>
        <button
          onClick={restartQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">
        Question {index + 1} of {questions.length}
      </h2>
      <p className="text-lg">{he.decode(current.question)}</p>

      <div className="grid gap-4">
        {allAnswers.map((answer, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(answer)}
            disabled={selected}
            className={`p-3 rounded border ${
              selected
                ? answer === current.correct_answer
                  ? "bg-green-400 text-white"
                  : answer === selected
                  ? "bg-red-400 text-white"
                  : "bg-gray-200"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            {he.decode(answer)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
