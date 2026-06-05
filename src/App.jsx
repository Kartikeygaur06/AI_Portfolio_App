import React, { useState, useEffect } from "react";
import { 
  User, 
  Briefcase, 
  Sparkles,
  GraduationCap,
  LayoutDashboard,
  Code,
  BookOpen,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { portfolioData } from "./portfolioData.js";
import { 
  ProfileHeader, 
  ResumeSummarySection, 
  AboutSection, 
  ExperienceSection, 
  ProjectsSection, 
  SkillsSection, 
  EducationSection 
} from "./components/PortfolioSections.jsx";
import { CopilotWidget } from "./components/CopilotWidget.jsx";

export default function App() {
  const [activeTab, setActiveTab ] = useState("resume");
  const [activeSection, setActiveSection] = useState("overview");
  
  // Clean scroll to top behavior on mobile tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <Terminal className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <Code className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "skills":
        return <SkillsSection data={portfolioData} />;
      case "experience":
        return <ExperienceSection data={portfolioData} />;
      case "projects":
        return <ProjectsSection data={portfolioData} />;
      case "education":
        return <EducationSection data={portfolioData} />;
      case "overview":
      default:
        return (
          <div className="space-y-6">
            <ProfileHeader data={portfolioData} />
            <ResumeSummarySection data={portfolioData} />
            <AboutSection data={portfolioData} />
          </div>
        );
    }
  };

  return (
    <div id="full-portfolio-app" className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* Visual Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-display font-bold">
              KG
            </div>
            <div>
              <span className="text-sm font-bold font-display text-slate-900 tracking-tight block">
                Kartikey Gaur
              </span>
              <span className="text-[10px] font-mono font-semibold text-rose-600 uppercase tracking-wider block leading-none">
                Portfolio & Copilot
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick stats on Desktop */}
            <div className="hidden lg:flex items-center gap-5 text-xs font-mono text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>BITS Hyderabad</span>
              </div>
              <div className="text-slate-200">|</div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>PS1 @ Caarya Innovative</span>
              </div>
            </div>

            {/* Mobile Tab Toggles */}
            <div className="lg:hidden flex bg-slate-100 p-1 rounded-xl" id="mobile-view-tabs">
              <button
                onClick={() => setActiveTab("resume")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "resume"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                id="tab-resume-btn"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("copilot")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "copilot"
                    ? "bg-white text-rose-700 shadow-xs"
                    : "text-slate-500 hover:text-rose-600"
                }`}
                id="tab-copilot-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col min-h-0">
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0">
          
          {/* LEFT PANEL */}
          <div 
            className={`md:col-span-12 lg:col-span-7 xl:col-span-7 col-span-1 flex flex-col md:flex-row gap-6 max-h-full ${
              activeTab === "resume" ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Sidebar Navigation */}
            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide md:w-48 lg:w-40 flex-shrink-0 md:sticky md:top-0">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeSection === item.id 
                      ? "bg-rose-50 text-rose-700 font-bold" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pr-0 lg:pr-2 lg:max-h-[calc(100vh-140px)]" id="resume-scroll-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT PANEL: AI Copilot */}
          <div 
            className={`md:col-span-12 lg:col-span-5 xl:col-span-5 col-span-1 h-[calc(100vh-140px)] sticky top-[76px] ${
              activeTab === "copilot" ? "block" : "hidden lg:block"
            }`}
            id="copilot-sticky-container"
          >
            <CopilotWidget data={portfolioData} />
          </div>

        </div>
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 text-center text-xs text-slate-400 font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Kartikey Gaur. BITS Pilani Hyderabad Campus.</p>
          <p className="font-mono text-[10px] text-slate-400">
            Designed for Caarya Innovative PS1 Evaluation Project.
          </p>
        </div>
      </footer>
    </div>
  );
}
