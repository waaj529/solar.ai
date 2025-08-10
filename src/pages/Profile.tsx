import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../shared/ui/card';
import { Button } from '../shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../shared/ui/dialog';
import { Input } from '../shared/ui/input';
import { Label } from '../shared/ui/label';
import { Textarea } from '../shared/ui/textarea';
import { PlusCircle, FolderKanban, Clock, Home as HomeIcon, Trash2, ArrowRight, LogOut } from 'lucide-react';

type ProjectStatus = 'Draft' | 'In Progress' | 'Completed';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

interface ActivityItem {
  id: string;
  type: 'project:create' | 'project:open' | 'project:delete' | 'signin';
  title: string;
  timestamp: string;
}

const storageKeys = {
  projects: (userId: string) => `projects_${userId}`,
  activity: (userId: string) => `activity_${userId}`,
};

function useUserProjects(userId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    if (!userId) return;
    try {
      const raw = localStorage.getItem(storageKeys.projects(userId));
      setProjects(raw ? (JSON.parse(raw) as Project[]) : []);
    } catch {
      setProjects([]);
    }
  }, [userId]);
  const save = (next: Project[]) => {
    if (!userId) return;
    setProjects(next);
    localStorage.setItem(storageKeys.projects(userId), JSON.stringify(next));
  };
  return { projects, save };
}

function useActivity(userId: string | null) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  useEffect(() => {
    if (!userId) return;
    try {
      const raw = localStorage.getItem(storageKeys.activity(userId));
      setItems(raw ? (JSON.parse(raw) as ActivityItem[]) : []);
    } catch {
      setItems([]);
    }
  }, [userId]);
  const append = (item: ActivityItem) => {
    if (!userId) return;
    const next = [item, ...items].slice(0, 25);
    setItems(next);
    localStorage.setItem(storageKeys.activity(userId), JSON.stringify(next));
  };
  return { items, append };
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = user?.id || null;

  const { projects, save } = useUserProjects(userId);
  const { items: activity, append } = useActivity(userId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState<boolean>(() => {
    const state = (location.state as any) || {};
    if (state.showWelcomeOverlay) return true;
    const alreadyShown = sessionStorage.getItem('welcome_overlay_shown');
    if (!alreadyShown) {
      try {
        const raw = localStorage.getItem('last_signup_name');
        if (raw) return true;
      } catch {}
    }
    return false;
  });
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const { fullName } = useMemo(() => {
    let signupFirst = '';
    let signupLast = '';
    try {
      const raw = localStorage.getItem('last_signup_name');
      if (raw) {
        const parsed = JSON.parse(raw) as { firstName?: string; lastName?: string };
        signupFirst = parsed.firstName || '';
        signupLast = parsed.lastName || '';
      }
    } catch {}

    const candidateFirst = user?.firstName || signupFirst || 'Friend';
    const candidateLast = (user?.lastName && user.lastName !== 'Demo') ? user.lastName : (signupLast || '');
    const name = `${candidateFirst} ${candidateLast}`.trim();
    return { fullName: name };
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    const sessionKey = `profile_signin_recorded_${userId}`;
    if (!sessionStorage.getItem(sessionKey)) {
      append({ id: `act_${Date.now()}`, type: 'signin', title: 'Signed in', timestamp: new Date().toISOString() });
      sessionStorage.setItem(sessionKey, '1');
    }
  }, [userId]);

  useEffect(() => {
    if ((location.state as any)?.showWelcomeOverlay) {
      // Clear the state flag so refresh won't retrigger
      window.history.replaceState({}, document.title);
    }
    if (showWelcomeOverlay) {
      sessionStorage.setItem('welcome_overlay_shown', '1');
    }
  }, [location.state, showWelcomeOverlay]);

  const handleCreateProject = () => {
    if (!userId) return;
    const trimmed = projectName.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const newProject: Project = { id: `proj_${Date.now()}`, name: trimmed, description: projectDescription.trim() || undefined, status: 'Draft', createdAt: now, updatedAt: now };
    const next = [newProject, ...projects];
    save(next);
    append({ id: `act_${Date.now()}`, type: 'project:create', title: `Created project “${trimmed}”`, timestamp: now });
    setProjectName('');
    setProjectDescription('');
    setIsDialogOpen(false);
  };

  const handleOpenProject = (project: Project) => {
    localStorage.setItem('current_project_id', project.id);
    append({ id: `act_${Date.now()}`, type: 'project:open', title: `Opened project “${project.name}”`, timestamp: new Date().toISOString() });
    navigate('/envision');
  };

  const handleDeleteProject = (projectId: string) => {
    const next = projects.filter((p) => p.id !== projectId);
    const deleted = projects.find((p) => p.id === projectId);
    save(next);
    if (deleted) {
      append({ id: `act_${Date.now()}`, type: 'project:delete', title: `Deleted project “${deleted?.name}”`, timestamp: new Date().toISOString() });
    }
  };

  // Show only the greeting overlay first; render profile content only after it completes
  if (showWelcomeOverlay) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-secondary/10 via-background to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 animate-overlay-in-out" onAnimationEnd={() => setShowWelcomeOverlay(false)}>
          <div className="text-center px-6">
            <div className="inline-block">
              <span className="block text-4xl md:text-5xl font-extrabold italic font-montserrat text-gradient-brand animate__animated animate__slideInLeft animate__verySlow">Welcome</span>
              <span className="block text-4xl md:text-5xl font-extrabold italic font-montserrat text-gradient-brand animate__animated animate__slideInLeft animate__verySlow" style={{ animationDelay: '600ms' }}>{fullName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-secondary/10 via-background to-primary/10 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold italic font-montserrat text-gradient-brand animate-fade-slide-up">Welcome, {fullName}!</h1>
          <p className="mt-2 text-gray-700 animate-fade-slide-up animation-delay-150">Your solar design workspace is ready.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-200 via-yellow-100 to-yellow-300 text-black hover:brightness-105"><PlusCircle className="mr-1 h-4 w-4" /> New Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create a new project</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project name</Label>
                    <Input id="project-name" placeholder="e.g., 10kW Residential Rooftop" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-desc">Description (optional)</Label>
                    <Textarea id="project-desc" placeholder="Short notes about the site, goals, or constraints" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateProject} disabled={!projectName.trim()}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => navigate('/')}> <HomeIcon className="mr-2 h-4 w-4" /> Go to Home</Button>
            <Button variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={() => { logout(); navigate('/signin', { replace: true }); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          <div className="md:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FolderKanban className="h-5 w-5 text-green-600" />Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center text-gray-700 py-6"><p className="mb-2">No projects yet.</p><p className="text-sm">Create your first project to start designing with GREEN Infina.</p></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="rounded-lg border p-4 bg-white">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            {project.description && (<p className="mt-1 text-sm text-gray-600 line-clamp-2">{project.description}</p>)}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-md border ${project.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : project.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{project.status}</span>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Created {new Date(project.createdAt).toLocaleDateString()} · Updated {new Date(project.updatedAt).toLocaleDateString()}</div>
                        <div className="mt-4 flex items-center gap-2">
                          <Button size="sm" onClick={() => handleOpenProject(project)}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50" onClick={() => handleDeleteProject(project.id)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 flex flex-col">
            <Card className="bg-white/90 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-yellow-600" />Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="h-full flex flex-col">
                {activity.length === 0 ? (
                  <p className="text-sm text-gray-700">No recent activity yet.</p>
                ) : (
                  <ul className="space-y-3 mt-1 flex-1">
                    {activity.slice(0, 8).map((a) => (
                      <li key={a.id} className="flex items-start justify-between gap-3">
                        <span className="text-sm text-gray-800">{a.title}</span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(a.timestamp).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

 