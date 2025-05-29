import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import apiClient from "@/lib/api";
import { ChevronRight, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectSection() {
  const [projects, setProjects] = useState<
    {
      _id: string;
      title: string;
      description: string;
      workingHoursPerDay: number;
      breakMinutesPerDay: number;
      hourlyRate: number;
    }[]
  >([]);

  const handleCreateProject = async () => {
    try {
      const result = await apiClient.post("/project", {
        title: "New Project",
        description: "Project description",
        workingHoursPerDay: 8,
        breakMinutesPerDay: 60,
        hourlyRate: 20,
      });
      setProjects((prev) => [...prev, result.data.project]);
    } catch (error) {
      console.error("Failed to create project:", error);
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
            <SidebarMenuButton
              tooltip="Create a project"
              onClick={handleCreateProject}
            >
              <PlusCircleIcon />
              <span>Create Project</span>
            </SidebarMenuButton>
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
                    {["Timetracking", "Timetable", "Graph", "Settings"].map(
                      (subItem) => (
                        <SidebarMenuSubItem key={subItem}>
                          <SidebarMenuSubButton asChild>
                            <a href="#">
                              <span>{subItem}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    )}
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
