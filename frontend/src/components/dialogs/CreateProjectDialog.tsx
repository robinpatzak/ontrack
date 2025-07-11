import { FormDialog } from "@/components/dialogs/FormDialog";
import type { Project } from "@/components/sidebar/ProjectSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

interface CreateProjectDialogProps {
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function CreateProjectDialog({
  setProjects,
}: CreateProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workingHoursPerDay: 8,
    breakMinutesPerDay: 60,
    hourlyRate: 20,
  });

  const updateField = (field: keyof typeof formData, value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    const result = await apiClient.post("/project", formData);
    setProjects((prev) => [...prev, result.data.project]);
    setFormData({
      title: "",
      description: "",
      workingHoursPerDay: 8,
      breakMinutesPerDay: 60,
      hourlyRate: 20,
    });
  };

  return (
    <FormDialog
      title="Create New Project"
      description="Enter details for your new project."
      trigger={
        <SidebarMenuButton tooltip="Create a project">
          <PlusCircleIcon />
          <span>Create Project</span>
        </SidebarMenuButton>
      }
      formFields={
        <>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Project Title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Project Description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workingHoursPerDay">Working Hours per Day</Label>
            <Input
              id="workingHoursPerDay"
              type="number"
              value={formData.workingHoursPerDay}
              onChange={(e) =>
                updateField("workingHoursPerDay", Number(e.target.value))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="breakMinutesPerDay">Break Minutes per Day</Label>
            <Input
              id="breakMinutesPerDay"
              type="number"
              value={formData.breakMinutesPerDay}
              onChange={(e) =>
                updateField("breakMinutesPerDay", Number(e.target.value))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hourlyRate">Hourly Rate</Label>
            <Input
              id="hourlyRate"
              type="number"
              step={0.01}
              value={formData.hourlyRate}
              onChange={(e) =>
                updateField("hourlyRate", Number(e.target.value))
              }
            />
          </div>
        </>
      }
      onSubmit={handleSubmit}
      submitLabel="Create"
      disabled={!formData.title.trim()}
    />
  );
}
