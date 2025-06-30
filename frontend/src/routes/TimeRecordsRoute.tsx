import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading3 } from "@/components/ui/typography";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

type TimeRecord = {
  date: string;
  startTime?: string;
  endTime?: string;
  totalWorkTime: number;
  totalBreakTime: number;
  currentWorkTime: number;
  currentBreakTime: number;
};

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatHourMinute = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export default function TimeRecordsRoute() {
  const { id } = useParams<{ id: string }>();

  const [timeEntries, setTimeEntries] = useState<TimeRecord[] | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    breakMinutes: "30",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post(`/time-entries/${id}/manual`, {
        ...formData,
        breakDuration: parseInt(formData.breakMinutes, 10) * 60, // convert to seconds
      });

      // Refresh entries
      const res = await apiClient.get(`/time-entries/${id}`);
      setTimeEntries(res.data.timeEntries);
    } catch (error) {
      console.error("Error submitting manual entry:", error);
    }
  };

  useEffect(() => {
    const getTimeEntries = async () => {
      try {
        const response = await apiClient.get(`/time-entries/${id}`);
        const { timeEntries } = response.data;
        setTimeEntries(timeEntries);
      } catch (error) {
        console.error("Error fetching time entries:", error);
        setTimeEntries(null);
      }
    };

    getTimeEntries();
  }, [id]);

  return (
    <div className="p-6">
      <Heading3>Tracked Time</Heading3>
      {timeEntries ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Work Time</TableHead>
              <TableHead>Break Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell>{formatHourMinute(entry.startTime)}</TableCell>
                <TableCell>{formatHourMinute(entry.endTime)}</TableCell>
                <TableCell>{formatTime(entry.totalWorkTime)}</TableCell>
                <TableCell>{formatTime(entry.totalBreakTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>Loading or failed to load time entries.</div>
      )}
    </div>
  );
}
