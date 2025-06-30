import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api";
import type { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TimerProps {
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
  projectId: string;
}

interface TimeEntry {
  _id: string;
  totalWorkTime: number;
  totalBreakTime: number;
  currentWorkTime: number;
  currentBreakTime: number;
  isWorkActive: boolean;
  isBreakActive: boolean;
  workStartedAt?: string;
  breakStartedAt?: string;
}

export default function Timer({
  workingHoursPerDay,
  breakMinutesPerDay,
  projectId,
}: TimerProps) {
  const [workTime, setWorkTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [isBreakRunning, setIsBreakRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const workIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<number>(Date.now());

  const totalWorkTimeGoal = workingHoursPerDay * 3600;
  const totalBreakTimeGoal = breakMinutesPerDay * 60;

  const fetchTimeEntry = useCallback(async () => {
    try {
      const response = await apiClient.get(`/time-entries/${projectId}/today`);
      const data = response.data;

      if (data.success) {
        const timeEntry: TimeEntry = data.timeEntry;
        setWorkTime(timeEntry.currentWorkTime);
        setBreakTime(timeEntry.currentBreakTime);
        setIsWorkRunning(timeEntry.isWorkActive);
        setIsBreakRunning(timeEntry.isBreakActive);

        if (timeEntry.isWorkActive) {
          startLocalWorkTimer();
        } else if (timeEntry.isBreakActive) {
          startLocalBreakTimer();
        }

        lastSyncRef.current = Date.now();
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status !== 404) {
        console.error("Error fetching the time entry:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const startLocalWorkTimer = () => {
    if (workIntervalRef.current) {
      clearInterval(workIntervalRef.current);
    }
    workIntervalRef.current = setInterval(() => {
      setWorkTime((prev) => prev + 1);
    }, 1000);
  };

  const startLocalBreakTimer = () => {
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
    }
    breakIntervalRef.current = setInterval(() => {
      setBreakTime((prev) => prev + 1);
    }, 1000);
  };

  const clearAllTimers = () => {
    if (workIntervalRef.current) {
      clearInterval(workIntervalRef.current);
      workIntervalRef.current = null;
    }
    if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
      breakIntervalRef.current = null;
    }
  };

  const startWork = async () => {
    try {
      const response = await apiClient.post(
        `/time-entries/${projectId}/start-work`
      );
      const data = response.data;

      if (data.success) {
        const timeEntry: TimeEntry = data.timeEntry;
        setWorkTime(timeEntry.currentWorkTime);
        setBreakTime(timeEntry.currentBreakTime);
        setIsWorkRunning(true);
        setIsBreakRunning(false);

        clearAllTimers();
        startLocalWorkTimer();
        lastSyncRef.current = Date.now();
      }
    } catch (error) {
      console.error("Error starting the work timer:", error);
    }
  };

  const startBreak = async () => {
    try {
      const response = await apiClient.post(
        `/time-entries/${projectId}/start-break`
      );
      const data = response.data;

      if (data.success) {
        const timeEntry: TimeEntry = data.timeEntry;
        setWorkTime(timeEntry.currentWorkTime);
        setBreakTime(timeEntry.currentBreakTime);
        setIsWorkRunning(false);
        setIsBreakRunning(true);

        clearAllTimers();
        startLocalBreakTimer();
        lastSyncRef.current = Date.now();
      }
    } catch (error) {
      console.error("Error starting the break timer:", error);
    }
  };

  const toggleTimer = async () => {
    if (isBreakRunning) {
      await startWork();
    } else if (isWorkRunning) {
      await startBreak();
    } else {
      await startWork();
    }
  };

  const stopTimers = async () => {
    try {
      const response = await apiClient.post(
        `/time-entries/${projectId}/stop-timers`
      );
      const data = response.data;

      if (data.success) {
        const timeEntry: TimeEntry = data.timeEntry;
        setWorkTime(timeEntry.currentWorkTime);
        setBreakTime(timeEntry.currentBreakTime);
        setIsWorkRunning(false);
        setIsBreakRunning(false);

        clearAllTimers();
        lastSyncRef.current = Date.now();
      }
    } catch (error) {
      console.error("Error stopping the timers:", error);
    }
  };

  const resetTimers = async () => {
    try {
      const response = await apiClient.post(
        `/time-entries/${projectId}/reset-timers`
      );
      const data = response.data;

      if (data.success) {
        setWorkTime(0);
        setBreakTime(0);
        setIsWorkRunning(false);
        setIsBreakRunning(false);

        clearAllTimers();
        lastSyncRef.current = Date.now();
      }
    } catch (error) {
      console.error("Error resetting the timers:", error);
    }
  };

  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (
        (isWorkRunning || isBreakRunning) &&
        document.visibilityState === "visible"
      ) {
        fetchTimeEntry();
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [isWorkRunning, isBreakRunning, fetchTimeEntry]);

  useEffect(() => {
    fetchTimeEntry();
    return () => {
      clearAllTimers();
    };
  }, [fetchTimeEntry, projectId]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading timer...</div>
      </div>
    );
  }

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
          onClick={stopTimers}
          disabled={!isWorkRunning && !isBreakRunning}
        >
          Finish Work
        </Button>
      </div>
      <Button onClick={resetTimers} variant="destructive">
        <Trash /> Delete todays entry
      </Button>
    </div>
  );
}
