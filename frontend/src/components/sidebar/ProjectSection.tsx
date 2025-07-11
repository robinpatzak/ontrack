import CreateProjectDialog from "@/components/dialogs/CreateProjectDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

export interface Project {
  _id: string;
  title: string;
  description: string;
  workingHoursPerDay: number;
  breakMinutesPerDay: number;
  hourlyRate: number;
}

export default function ProjectSection() {
  const location = useLocation();
  const currentProjectId =
    location.pathname.match(/\/([a-f0-9]{24})/)?.[1] || null;

  const [projects, setProjects] = useState<Project[]>([]);
  const [openProjectId, setOpenProjectId] = useState<string | null>(
    currentProjectId
  );

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

  useEffect(() => {
    setOpenProjectId(currentProjectId);
  }, [currentProjectId]);

  return (
    <>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <CreateProjectDialog setProjects={setProjects} />
          </SidebarMenuItem>
        </SidebarMenu>

        {projects.length > 0 && (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openProjectId || ""}
            onValueChange={(value) => setOpenProjectId(value)}
          >
            {projects.map((project) => (
              <AccordionItem key={project._id} value={project._id}>
                <AccordionTrigger className="flex items-center justify-between px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                  <Link
                    to={`/dashboard/${project._id}`}
                    className="flex-1 text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{project.title}</span>
                  </Link>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <SidebarMenuSub>
                    {[
                      {
                        title: "Timetracking",
                        to: `/dashboard/${project._id}/timetracking`,
                      },
                      // TODO: add these routes
                      {
                        title: "Time Records",
                        to: `/dashboard/${project._id}/timerecords`,
                      },
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </SidebarGroupContent>
    </>
  );
}
