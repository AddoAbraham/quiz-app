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
      className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center text-blue-700">
        Quiz Settings
      </h2>

      <div>
        <label className="block font-medium mb-1">Number of Questions</label>
        <input
          type="number"
          min={1}
          max={20}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Category</option>
          <option value="9">General Knowledge</option>
          <option value="18">Science: Computers</option>
          <option value="21">Sports</option>
          <option value="23">History</option>
          {/* Add more categories if needed */}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
      >
        Start Quiz
      </button>
    </form>
  );
};

export default QuizSettings;
