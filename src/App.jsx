import { useState } from "react";
import QuizSettings from "./components/QuizSettings";
import Quiz from "./components/Quiz";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [settings, setSettings] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-center space-x-4 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="w-12" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="w-12" alt="React logo" />
        </a>
      </header>

      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Quiz App
      </h1>

      {!settings ? (
        <QuizSettings startQuiz={setSettings} />
      ) : (
        <Quiz settings={settings} restartQuiz={() => setSettings(null)} />
      )}
    </div>
  );
}

export default App;
