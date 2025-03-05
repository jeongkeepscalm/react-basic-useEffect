import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {

  const [remainingTime, setRemainingTime] = useState(timer);

  // 무한 루프 발생 -> useEffect 로 해결
  // setInterval(() => {
  //   console.log("Interval set");
  //   setRemainingTime((prev) => prev - 10)
  // }, 10);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval set");
      setRemainingTime((prev) => prev - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <progress value={remainingTime} max={timer} />
  );
}
