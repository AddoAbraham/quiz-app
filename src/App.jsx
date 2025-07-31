import { useState } from "react";
import QuizSettings from "./components/QuizSettings"; // renamed SettingsForm
import SettingsForm from "./components/SettingsForm";
import Quiz from "./components/Quiz";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// Optional: Add framer-motion animation (if used in child components)
// import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [settings, setSettings] = useState(null);

  const startQuiz = (selectedSettings) => {
    setSettings(selectedSettings);
  };

  const restartQuiz = () => {
    setSettings(null); // Back to settings form
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex flex-col items-center">
      <header className="flex justify-center items-center space-x-4 mb-4 sm:mb-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="w-10 sm:w-12" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="w-10 sm:w-12" alt="React logo" />
        </a>
      </header>

      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-blue-600">
        Quiz App
      </h1>

      {/* Responsive container for the form or quiz */}
      <div className="w-full max-w-2xl px-2 sm:px-4">
        {!settings ? (
          <QuizSettings startQuiz={startQuiz} />
        ) : (
          <Quiz settings={settings} restartQuiz={restartQuiz} />
        )}
      </div>
    </div>
  );
}

export default App;
