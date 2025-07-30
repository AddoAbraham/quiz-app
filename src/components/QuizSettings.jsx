import { useState } from "react";

const QuizSettings = ({ startQuiz }) => {
  const [amount, setAmount] = useState(5);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    startQuiz({ amount, category, difficulty });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow max-w-md mx-auto"
    >
      <div>
        <label className="block mb-1">Number of Questions</label>
        <input
          type="number"
          min={1}
          max={20}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Any Category</option>
          <option value="9">General Knowledge</option>
          <option value="18">Science: Computers</option>
          <option value="23">History</option>
          <option value="21">Sports</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Start Quiz
      </button>
    </form>
  );
};

export default QuizSettings;
