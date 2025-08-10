import { 
  BarChart3, 
  Sun, 
  Zap, 
  FileText, 
  Home, 
  Calendar, 
  Download,
  ChevronRight,
  Search as SearchIcon,
  Wrench,
  Rocket,
  Leaf
} from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../shared/ui/sidebar";
import { Button } from "../shared/ui/button";
import { useAuth as useAuthHook } from "../features/auth/services/AuthContext";
import { useNavigate } from "react-router-dom";

const modules = [
  { id: "load-analysis", title: "Load Analysis", icon: BarChart3 },
  { id: "solar-yield", title: "Solar Yield Estimation", icon: Sun },
  { id: "sld-diagram", title: "Auto-Generated SLD", icon: Zap },
  { id: "bom", title: "Bill of Materials", icon: FileText },
  { id: "rooftop-layout", title: "Rooftop Layout", icon: Home },
  { id: "timeline", title: "Project Timeline", icon: Calendar },
  { id: "download", title: "Download Center", icon: Download },
];

const pages = [
  { id: "envision", title: "Envision", icon: SearchIcon, to: "/envision" },
  { id: "engineer", title: "Engineer", icon: Wrench, to: "/engineer" },
  { id: "empower", title: "Empower", icon: Rocket, to: "/empower" },
  { id: "evolve", title: "Evolve", icon: Leaf, to: "/evolve" },
  { id: "home", title: "Home", icon: Home, to: "/" },
];

interface ModuleSidebarProps {
  activeModule: string;
  onModuleSelect: (moduleId: string) => void;
}

export function ModuleSidebar({ activeModule, onModuleSelect }: ModuleSidebarProps) {
  const { user, logout } = useAuthHook();
  const navigate = useNavigate();
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'User';
  const email = user?.email || '';
  const firstLetter = (fullName || 'U').charAt(0).toUpperCase();
  const [query, setQuery] = useState("");
  const filteredModules = modules.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );
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
          {/* Profile card - clickable to open Profile */}
          <div className="mb-5 px-1">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              aria-label="Open user profile"
              className="w-full flex items-center gap-3 rounded-2xl border bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-md transition p-3 text-left"
            >
              <div
                className="h-10 w-10 rounded-xl text-white grid place-items-center font-bold shadow-sm"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, #4338CA 100%)",
                }}
              >
                {firstLetter}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[18px] font-extrabold leading-tight text-gray-900 truncate">{fullName}</div>
                <div className="text-sm text-muted-foreground truncate">{email}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Search box and section label */}
          <SidebarHeader className="px-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <SidebarInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search modules"
                className="pl-9 rounded-xl"
              />
            </div>
          </SidebarHeader>
          <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredModules.map((module) => (
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
                      onClick={() => {
                        try {
                          localStorage.setItem('active_dashboard_module', module.id);
                        } catch {}
                        onModuleSelect(module.id);
                        // If user is not on dashboard, navigate there to keep layout consistent
                        navigate('/dashboard');
                      }}
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

        {/* My Page section */}
        <SidebarGroup>
          <SidebarSeparator className="my-1" />
          <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground">MY PAGE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((page) => {
                const isHome = page.id === 'home';
                return (
                  <SidebarMenuItem key={page.id} className={isHome ? 'mt-10' : ''}>
                    <SidebarMenuButton asChild className={`rounded-md hover:bg-primary/10 ${isHome ? 'hover:bg-primary/5' : ''}`}>
                      <button
                        onClick={() => navigate(page.to)}
                        className={`w-full flex items-center gap-3 px-5 ${isHome ? 'py-5 text-xl font-semibold' : 'py-3 text-base font-semibold'}`}
                      >
                        <page.icon className={isHome ? 'h-9 w-9' : 'h-5 w-5'} />
                        <span className="truncate">{page.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto">
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
            onClick={() => {
              logout();
              navigate('/signin');
            }}
          >
            Sign out
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}