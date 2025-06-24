import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
}

export default function Timer({
  workingHoursPerDay,
  breakMinutesPerDay,
}: TimerProps) {
  const [workTime, setWorkTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [isBreakRunning, setIsBreakRunning] = useState(false);

  const workIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalWorkTimeGoal = workingHoursPerDay * 3600;
  const totalBreakTimeGoal = breakMinutesPerDay * 60;

  const toggleTimer = () => {
    // TODO: save the timestamps in the database on each click to track work and break times accurately

    if (isBreakRunning) {
      setIsBreakRunning(false);
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
        breakIntervalRef.current = null;
      }

      setIsWorkRunning(true);
      workIntervalRef.current = setInterval(() => {
        setWorkTime((prev) => prev + 1);
      }, 1000);
    } else if (isWorkRunning) {
      setIsWorkRunning(false);
      if (workIntervalRef.current) {
        clearInterval(workIntervalRef.current);
        workIntervalRef.current = null;
      }

      setIsBreakRunning(true);
      breakIntervalRef.current = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
    } else {
      setIsWorkRunning(true);
      workIntervalRef.current = setInterval(() => {
        setWorkTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const resetTimers = () => {
    setWorkTime(0);
    setBreakTime(0);
    setIsWorkRunning(false);
    setIsBreakRunning(false);

    if (workIntervalRef.current) {
      clearInterval(workIntervalRef.current);
      workIntervalRef.current = null;
    }
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }
  };

  const endTimer = () => {
    setIsWorkRunning(false);
    setIsBreakRunning(false);

    if (workIntervalRef.current) {
      clearInterval(workIntervalRef.current);
      workIntervalRef.current = null;
    }
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }

    // TODO: save the times in the database
  };

  useEffect(() => {
    return () => {
      if (workIntervalRef.current) {
        clearInterval(workIntervalRef.current);
      }
      if (breakIntervalRef.current) {
        clearInterval(breakIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatGoalTime = (seconds: number) => {
    if (seconds >= 3600) {
      return `${Math.floor(seconds / 3600)}h`;
    } else {
      return `${Math.floor(seconds / 60)}min`;
    }
  };

  const getButtonText = () => {
    if (isBreakRunning) return "Resume Work";
    if (isWorkRunning) return "Take Break";
    return "Start Work";
  };

  const workRemainingTime = Math.max(totalWorkTimeGoal - workTime, 0);
  const breakRemainingTime = Math.max(totalBreakTimeGoal - breakTime, 0);

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`border-2 ${
            isWorkRunning ? "border-green-500 bg-green-50" : ""
          }`}
        >
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Work Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Goal: {formatGoalTime(totalWorkTimeGoal)}
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="font-mono font-bold text-4xl md:text-6xl">
              {formatTime(workTime)}
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              Remaining: {formatTime(workRemainingTime)}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-2 ${
            isBreakRunning ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Break Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Goal: {formatGoalTime(totalBreakTimeGoal)}
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="font-mono font-bold text-4xl md:text-6xl">
              {formatTime(breakTime)}
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              Remaining: {formatTime(breakRemainingTime)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-y-2">
        <Button onClick={toggleTimer} size="lg" className="w-full">
          {getButtonText()}
        </Button>
        <Button
          className="w-full"
          onClick={endTimer}
          disabled={!isWorkRunning && !isBreakRunning}
        >
          Finish Work
        </Button>
        <Button className="w-full" onClick={resetTimers} variant="destructive">
          Reset Timers
        </Button>
      </div>
    </div>
  );
}
