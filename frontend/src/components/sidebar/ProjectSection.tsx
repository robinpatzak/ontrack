import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api";
import { ChevronRight, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Project {
  _id: string;
  title: string;
  description: string;
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
  hourlyRate: number;
}

interface ProjectFormData {
  title: string;
  description: string;
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
  hourlyRate: number;
}

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    workingHoursPerDay: 8,
    breakMinutesPerDay: 60,
    hourlyRate: 20,
  });

  const handleResetForm = () => {
    setFormData({
      title: "",
      description: "",
      workingHoursPerDay: 8,
      breakMinutesPerDay: 60,
      hourlyRate: 20,
    });
  };

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateProject = async () => {
    if (!formData.title.trim()) return;

    setIsCreating(true);

    try {
      const result = await apiClient.post("/project", formData);
      setProjects((prev) => [...prev, result.data.project]);
      setIsDialogOpen(false);
      handleResetForm();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get("/project");
        const { projects } = response.data;
        setProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton tooltip="Create a project">
                  <PlusCircleIcon />
                  <span>Create Project</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Enter details for your new project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Project Description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workingHoursPerDay">
                      Working Hours per Day
                    </Label>
                    <Input
                      id="workingHoursPerDay"
                      type="number"
                      min={1}
                      max={24}
                      value={formData.workingHoursPerDay}
                      onChange={(e) =>
                        handleInputChange(
                          "workingHoursPerDay",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="breakMinutesPerDay">
                      Break Minutes per Day
                    </Label>
                    <Input
                      id="breakMinutesPerDay"
                      type="number"
                      min={0}
                      value={formData.breakMinutesPerDay}
                      onChange={(e) =>
                        handleInputChange(
                          "breakMinutesPerDay",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        handleInputChange("hourlyRate", Number(e.target.value))
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      handleResetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleCreateProject}
                    disabled={isCreating || !formData.title.trim()}
                  >
                    {isCreating ? "Creating ..." : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {projects.map((project) => (
            <Collapsible
              key={project._id}
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={project.title}>
                    <span>{project.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {[
                      {
                        title: "Timetracking",
                        to: `/dashboard/project/${project._id}`,
                      },
                      // TODO: add these routes
                      // { title: "Timetable", to: "#" },
                      // { title: "Graph", to: "#" },
                      // { title: "Settings", to: "#" },
                    ].map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.to}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
}
