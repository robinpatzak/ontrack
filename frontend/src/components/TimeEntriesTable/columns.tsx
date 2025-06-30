import type { ColumnDef } from "@tanstack/react-table";
import type { TimeRecord } from "@/routes/TimeRecordsRoute";

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

export const columns: ColumnDef<TimeRecord>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "startTime",
    header: "Start",
    cell: ({ row }) => formatHourMinute(row.original.startTime),
  },
  {
    accessorKey: "endTime",
    header: "End",
    cell: ({ row }) => formatHourMinute(row.original.endTime),
  },
  {
    accessorKey: "totalWorkTime",
    header: "Work Time",
    cell: ({ row }) => formatTime(row.original.totalWorkTime),
  },
  {
    accessorKey: "totalBreakTime",
    header: "Break Time",
    cell: ({ row }) => formatTime(row.original.totalBreakTime),
  },
];
