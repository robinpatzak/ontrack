import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CreateTimeEntryDialog from "@/components/CreateTimeEntryDialog";
import { Heading3 } from "@/components/ui/typography";
import apiClient from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/TimeEntriesTable/columns";

export type TimeRecord = {
  date: string;
  startTime?: string;
  endTime?: string;
  totalWorkTime: number;
  totalBreakTime: number;
  currentWorkTime: number;
  currentBreakTime: number;
};

export default function TimeRecordsRoute() {
  const { id } = useParams<{ id: string }>();
  const [timeEntries, setTimeEntries] = useState<TimeRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/time-entries/${id}`);
        setTimeEntries(res.data.timeEntries ?? []);
      } catch (error) {
        console.error("Failed to load time entries", error);
        setTimeEntries([]);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="p-6">
      <Heading3>Tracked Time</Heading3>
      <CreateTimeEntryDialog onEntryCreated={setTimeEntries} />
      <DataTable columns={columns} data={timeEntries} />
    </div>
  );
}
