import { createContext } from "react";

export const SidebarContext = createContext<{
  isMobile: boolean;
  closeSidebar: () => void;
}>({
  isMobile: false,
  closeSidebar: () => {},
});
