import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { useNavigate } from "react-router";

export default function DashboardRoute() {
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
            <h1 className="text-base font-medium">Dashboard</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 px-2 py-4 md:gap-6 md:py-6">
          This is my content
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
