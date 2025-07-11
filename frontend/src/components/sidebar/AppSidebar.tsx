import ProjectSection from "@/components/sidebar/ProjectSection";
import UserSection from "@/components/sidebar/UserSection";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebarContext } from "@/hooks/useSidebarContext";
import { ArrowUpCircleIcon } from "lucide-react";
import { Link } from "react-router";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { closeSidebar } = useSidebarContext();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/dashboard" onClick={closeSidebar}>
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">OnTrack</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <ProjectSection />
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserSection />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
