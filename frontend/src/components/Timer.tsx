import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
}

export default function Timer({
  workingHoursPerDay,
  breakMinutesPerDay,
}: TimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalWorkTime = workingHoursPerDay * 3600;

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const remainingTime = Math.max(totalWorkTime - time, 0);

  return (
    <Card>
      <CardContent>
        <p className="font-mono font-bold text-6xl">{formatTime(time)}</p>
        <p className="font-mono text-sm text-center">{formatTime(remainingTime)}</p>
        <div className="flex justify-center">
          {!isRunning ? (
            <Button onClick={startTimer}>Start Timer</Button>
          ) : (
            <Button onClick={stopTimer}>Stop Timer</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
