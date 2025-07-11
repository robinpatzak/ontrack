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
import { useSidebarContext } from "@/hooks/useSidebarContext";
import apiClient from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  ClockIcon,
  SettingsIcon,
  TableIcon,
} from "lucide-react";
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

interface SubRoute {
  title: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export default function ProjectSection() {
  const { closeSidebar } = useSidebarContext();
  const location = useLocation();
  const currentProjectId =
    location.pathname.match(/\/([a-f0-9]{24})/)?.[1] || null;

  const [projects, setProjects] = useState<Project[]>([]);
  const [openProjectId, setOpenProjectId] = useState<string | null>(
    currentProjectId
  );

  const getSubRoutes = (projectId: string): SubRoute[] => [
    {
      title: "Time Tracking",
      to: `/dashboard/${projectId}/timetracking`,
      icon: ClockIcon,
      disabled: false,
    },
    {
      title: "Time Records",
      to: `/dashboard/${projectId}/timerecords`,
      icon: TableIcon,
      disabled: false,
    },
    {
      title: "Analytics",
      to: `/dashboard/${projectId}/analytics`,
      icon: BarChart3Icon,
      disabled: true,
    },
    {
      title: "Settings",
      to: `/dashboard/${projectId}/settings`,
      icon: SettingsIcon,
      disabled: true,
    },
  ];

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

  const isRouteActive = (route: string) => {
    return location.pathname === route;
  };

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
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSidebar();
                    }}
                  >
                    <span>{project.title}</span>
                  </Link>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <SidebarMenuSub>
                    {getSubRoutes(project._id).map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        {subItem.disabled ? (
                          <div
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                              "text-muted-foreground cursor-not-allowed opacity-50"
                            )}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </div>
                        ) : (
                          <SidebarMenuSubButton
                            asChild
                            isActive={isRouteActive(subItem.to)}
                          >
                            <Link
                              to={subItem.to}
                              onClick={(e) => {
                                e.stopPropagation();
                                closeSidebar();
                              }}
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        )}
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
