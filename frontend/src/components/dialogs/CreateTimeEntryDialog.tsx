import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

import { FormDialog } from "@/components/dialogs/FormDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarMenuButton } from "@/components/ui/sidebar";

import apiClient from "@/lib/api";
import type { TimeRecord } from "@/pages/dashboard/TimeRecordsRoute";
import { formatDateLocal } from "@/lib/utils";

interface CreateTimeEntryDialogProps {
  onEntryCreated: React.Dispatch<React.SetStateAction<TimeRecord[]>>;
}

export default function CreateTimeEntryDialog({
  onEntryCreated,
}: CreateTimeEntryDialogProps) {
  const { id } = useParams<{ id: string }>();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [formData, setFormData] = useState({
    startTime: "09:00:00",
    endTime: "17:30:00",
    breakMinutes: "30",
  });

  const updateField = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!id || !date) return;

    await apiClient.post(`/time-entries/${id}/add-time-entry`, {
      date: formatDateLocal(date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      breakDuration: parseInt(formData.breakMinutes, 10) * 60,
    });

    const res = await apiClient.get(`/time-entries/${id}`);
    onEntryCreated(res.data.timeEntries);

    setDate(new Date());
    setFormData({
      startTime: "09:00:00",
      endTime: "17:30:00",
      breakMinutes: "30",
    });
  };

  return (
    <FormDialog
      title="Add Manual Time Entry"
      description="Enter a custom time entry for this project."
      trigger={
        <SidebarMenuButton tooltip="Add Time Entry">
          <PlusCircleIcon />
          <span>Add Entry</span>
        </SidebarMenuButton>
      }
      formFields={
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Date
              </Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-full justify-between font-normal"
                  >
                    {date ? formatDateLocal(date) : "Select date"}
                    <PlusCircleIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setIsDateOpen(false);
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="breakMinutes" className="px-1">
                Break (Minutes)
              </Label>
              <Input
                id="breakMinutes"
                type="number"
                min={0}
                value={formData.breakMinutes}
                onChange={(e) => updateField("breakMinutes", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="startTime" className="px-1">
                Start Time
              </Label>
              <Input
                type="time"
                id="startTime"
                step="1"
                value={formData.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="endTime" className="px-1">
                End Time
              </Label>
              <Input
                type="time"
                id="endTime"
                step="1"
                value={formData.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
        </div>
      }
      onSubmit={handleSubmit}
      submitLabel="Add Entry"
    />
  );
}
