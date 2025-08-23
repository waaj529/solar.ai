import React, { useEffect, useState } from 'react';
import { ModuleSidebar } from "../components/ModuleSidebar";
import { SidebarProvider, SidebarTrigger } from "../shared/ui/sidebar";
import { LoadAnalysis } from "../components/modules/LoadAnalysis";
import { SolarYield } from "../components/modules/SolarYield";
import { SLDDiagram } from "../components/modules/SLDDiagram";
import { BillOfMaterials } from "../components/modules/BillOfMaterials";
import { RooftopLayout } from "../components/modules/RooftopLayout";
import { ProjectTimeline } from "../components/modules/ProjectTimeline";
import { DownloadCenter } from "../components/modules/DownloadCenter";

import { runLoadAnalysis } from "../lib/api";

const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState(() => {
    const stored = localStorage.getItem('active_dashboard_module');
    return stored || "load-analysis";
  });

  // When arriving on dashboard, attempt to run load analysis if we have
  // a recent NLP id and a user id stored.
  useEffect(() => {
    const userId = localStorage.getItem('encrypted_user_id') || localStorage.getItem('anon_user_id') || '';
    const nlpId = localStorage.getItem('latest_nlp_id') || '';
    const status = localStorage.getItem(`load_triggered_${nlpId}`);
    // Only self-trigger if Envision didn't already start it
    if (userId && nlpId && status !== 'done' && status !== 'pending') {
      (async () => {
        try {
          // Guard against duplicate triggers
          localStorage.setItem(`load_triggered_${nlpId}`, 'pending');
          const res = await runLoadAnalysis({ user_id: userId, nlp_id: nlpId });
          // Persist returned load_id for GET usage
          const loadId = (res as any)?.load_id;
          if (loadId) {
            localStorage.setItem('latest_load_id', String(loadId));
          }
          localStorage.setItem(`load_triggered_${nlpId}`, 'done');
          // eslint-disable-next-line no-console
          console.log('Dashboard → load analysis triggered:', res);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Dashboard → load analysis trigger failed:', e);
          try { localStorage.removeItem(`load_triggered_${nlpId}`); } catch {}
        }
      })();
    }
  }, []);

  // Persist the currently active module so other pages (e.g., Profile) can deep-link
  useEffect(() => {
    try {
      localStorage.setItem('active_dashboard_module', activeModule);
    } catch {}
  }, [activeModule]);

  const renderModule = () => {
    switch (activeModule) {
      case "load-analysis":
        return <LoadAnalysis />;
      case "solar-yield":
        return <SolarYield />;
      case "sld-diagram":
        return <SLDDiagram />;
      case "bom":
        return <BillOfMaterials />;
      case "rooftop-layout":
        return <RooftopLayout />;
      case "timeline":
        return <ProjectTimeline />;
      case "download":
        return <DownloadCenter />;
      default:
        return <LoadAnalysis />;
    }
  };

  return (
    <SidebarProvider>
      {/*
       * The main container uses a subtle diagonal gradient derived from
       * our secondary (yellow) and primary (green) colours with a
       * neutral midpoint.  This creates a gentle wash similar to the
       * GREEN Infina landing page without overpowering the content.
       */}
      <div className="min-h-screen flex w-full bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        {/* Mobile sidebar trigger */}
        <div className="fixed top-2 left-2 z-50 md:hidden">
          <SidebarTrigger className="h-9 w-9 rounded-lg border bg-white/90 backdrop-blur-sm shadow-sm" />
        </div>
        {/* Removed top-right Back to Main Site button; Home entry added in sidebar */}

        <ModuleSidebar
          activeModule={activeModule}
          onModuleSelect={setActiveModule}
        />
        {/*
         * Responsive layout with mobile-first approach.
         * Adjusted padding and spacing for different screen sizes.
         */}
        <main className="flex-1 p-4 sm:p-6 lg:p-12 lg:pl-14 overflow-auto">
          <div className="max-w-6xl mx-auto">{renderModule()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;