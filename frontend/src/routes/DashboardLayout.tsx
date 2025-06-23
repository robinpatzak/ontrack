import AppSidebar from "@/components/sidebar/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import apiClient from "@/lib/api";
import React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
  isId: boolean;
  segment: string;
}

const MONGODB_ID_REGEX = /^[a-f0-9]{24}$/i;

export default function DashboardLayout() {
  const location = useLocation();

  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const loadingProjectsRef = useRef<Set<string>>(new Set());

  const fetchProjectName = useCallback(
    async (projectId: string) => {
      if (
        projectNames[projectId] ||
        loadingProjectsRef.current.has(projectId)
      ) {
        return;
      }

      loadingProjectsRef.current.add(projectId);

      try {
        const response = await apiClient.get(`/project/${projectId}`);

        if (response.data.success && response.data.project) {
          setProjectNames((prev) => ({
            ...prev,
            [projectId]: response.data.project.title,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        loadingProjectsRef.current.delete(projectId);
      }
    },
    [projectNames]
  );

  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];
    let currentPath = "";

    for (let index = 0; index < pathSegments.length; index++) {
      const segment = pathSegments[index];
      currentPath += `/${segment}`;

      const isId = MONGODB_ID_REGEX.test(segment);
      let displayName = segment.charAt(0).toUpperCase() + segment.slice(1);

      if (isId) {
        const isProjectId = index > 0 && pathSegments[index - 1] === "project";

        if (isProjectId) {
          if (projectNames[segment]) {
            displayName = projectNames[segment];
          } else if (loadingProjectsRef.current.has(segment)) {
            displayName = "Loading...";
          } else {
            displayName = `${segment.substring(0, 8)}...`;
            fetchProjectName(segment);
          }
        } else {
          displayName = `${segment.substring(0, 8)}...`;
        }
      }

      items.push({
        label: displayName,
        path: currentPath,
        isLast: index === pathSegments.length - 1,
        isId,
        segment,
      });
    }

    return items;
  }, [location.pathname, projectNames, fetchProjectName]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.path}>
                    <BreadcrumbItem
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {item.isLast ? (
                        <BreadcrumbPage
                          className={item.isId ? "text-muted-foreground" : ""}
                        >
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.path}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!item.isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
