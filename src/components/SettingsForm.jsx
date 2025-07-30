import { useState } from "react";
import SettingsForm from "./SettingsForm";
import Quiz from "./Quiz";

function App() {
  const [settings, setSettings] = useState(null);

  const startQuiz = (selectedSettings) => {
    setSettings(selectedSettings);
  };

  const restartQuiz = () => {
    setSettings(null); // Back to settings form
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {settings ? (
        <Quiz settings={settings} restartQuiz={restartQuiz} />
      ) : (
        <SettingsForm startQuiz={startQuiz} />
      )}
    </div>
  );
}

export default App;
