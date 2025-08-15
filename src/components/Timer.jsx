import { useEffect, useState } from "react";

const Timer = ({ duration, onTimeUp, isRunning, keyReset }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isRunning) return;

    setTimeLeft(duration);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, keyReset, duration, onTimeUp]);

  return (
    <div className="text-center font-bold text-red-600">
      ⏳ {timeLeft}s left
    </div>
  );
};

export default Timer;
