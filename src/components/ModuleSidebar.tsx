import { useState } from "react";
import { 
  BarChart3, 
  Sun, 
  Zap, 
  FileText, 
  Home, 
  Calendar, 
  Download 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const modules = [
  { id: "load-analysis", title: "Load Analysis", icon: BarChart3 },
  { id: "solar-yield", title: "Solar Yield Estimation", icon: Sun },
  { id: "sld-diagram", title: "Auto-Generated SLD", icon: Zap },
  { id: "bom", title: "Bill of Materials", icon: FileText },
  { id: "rooftop-layout", title: "Rooftop Layout", icon: Home },
  { id: "timeline", title: "Project Timeline", icon: Calendar },
  { id: "download", title: "Download Center", icon: Download },
];

interface ModuleSidebarProps {
  activeModule: string;
  onModuleSelect: (moduleId: string) => void;
}

export function ModuleSidebar({ activeModule, onModuleSelect }: ModuleSidebarProps) {
  return (
    <Sidebar
      /*
       * Reduced sidebar width from w-80 to w-72 to create more space for content.
       * Give the sidebar a subtle vertical gradient derived from the
       * secondary and primary colours.  The border is kept thin to
       * separate the navigation from the main content without
       * dominating the page.  On narrow screens the sidebar will
       * collapse behind a drawer (handled by the shadcn sidebar
       * component).
       */
      className="w-72 border-r bg-gradient-to-b from-secondary/20 via-secondary/10 to-primary/10"
    >
      <SidebarContent>
        <SidebarGroup>
          {/* Brand heading */}
          <SidebarGroupLabel className="text-xl font-bold text-primary mb-6">
            Solar AI Planner
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((module) => (
                <SidebarMenuItem key={module.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeModule === module.id}
                    /*
                     * Active menu items get a stronger background with our
                     * primary colour and white foreground.  Hover states
                     * are softened versions of the primary hue.
                     */
                    className="rounded-md data-[active=true]:bg-primary/80 data-[active=true]:text-primary-foreground hover:bg-primary/10"
                  >
                    <button
                      onClick={() => onModuleSelect(module.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold"
                    >
                      <module.icon className="h-5 w-5" />
                      <span className="truncate">{module.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}