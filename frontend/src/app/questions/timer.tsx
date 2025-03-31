import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Start the timer when the component mounts
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000); // Updates every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Convert seconds to hh:mm:ss format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    // Ensure two digits for hours, minutes, and seconds
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="bg-sky-200 rounded-3xl p-2 mt-10">
      {formatTime(seconds)}
    </div>
  );
}

export default Timer;
