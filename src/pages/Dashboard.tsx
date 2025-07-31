import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ModuleSidebar } from "../components/ModuleSidebar";
import { SidebarProvider } from "../shared/ui/sidebar";
import { LoadAnalysis } from "../components/modules/LoadAnalysis";
import { SolarYield } from "../components/modules/SolarYield";
import { SLDDiagram } from "../components/modules/SLDDiagram";
import { BillOfMaterials } from "../components/modules/BillOfMaterials";
import { RooftopLayout } from "../components/modules/RooftopLayout";
import { ProjectTimeline } from "../components/modules/ProjectTimeline";
import { DownloadCenter } from "../components/modules/DownloadCenter";

const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState("load-analysis");

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
        {/* Back to main site navigation - responsive positioning */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50">
          <NavLink
            to="/"
            className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg border shadow-sm text-gray-700 hover:text-green-600 font-medium transition-colors text-xs sm:text-sm"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Main Site</span>
            <span className="sm:hidden">Back</span>
          </NavLink>
        </div>

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