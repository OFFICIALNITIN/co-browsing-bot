"use client";
import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TerminalWindow, { WindowState } from './TerminalWindow';
import { Code2, Briefcase, FolderGit2, Monitor, Cpu, FileText } from 'lucide-react';

// Import the content components
import SkillsContent from './SkillsContent';
import ExperienceContent from './ExperienceContent';
import ProjectsContent from './ProjectsContent';
import ResumeContent from './ResumeContent';

interface DesktopWindow {
  id: string;
  title: string;
  icon: ReactNode;
  component: ReactNode;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
}

const WINDOWS_CONFIG: DesktopWindow[] = [
  {
    id: 'skills',
    title: 'Skills.exe',
    icon: <Code2 className="w-4 h-4" />,
    component: <SkillsContent />,
    defaultPosition: { x: 200, y: 20 },
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'experience',
    title: 'Experience.log',
    icon: <Briefcase className="w-4 h-4" />,
    component: <ExperienceContent />,
    defaultPosition: { x: 250, y: 50 },
    defaultSize: { width: 750, height: 550 },
  },
  {
    id: 'projects',
    title: 'Projects.dir',
    icon: <FolderGit2 className="w-4 h-4" />,
    component: <ProjectsContent />,
    defaultPosition: { x: 300, y: 80 },
    defaultSize: { width: 850, height: 600 },
  },
  {
    id: 'resume',
    title: 'Resume.pdf',
    icon: <FileText className="w-4 h-4" />,
    component: <ResumeContent />,
    defaultPosition: { x: 350, y: 110 },
    defaultSize: { width: 850, height: 650 },
  },
];

const WindowsDesktop: React.FC = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [showDock, setShowDock] = useState(false);
  const desktopRef = useRef<HTMLElement>(null);

  const [windows, setWindows] = useState<WindowState[]>(() => {
    // Initial responsive setup
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    return WINDOWS_CONFIG.map((w, idx) => {
      let position = w.defaultPosition;
      let size = w.defaultSize;

      if (isMobile) {
        // Mobile-specific adjustments
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
        const width = Math.min(screenWidth - 32, 600); // 16px padding on each side

        position = {
          x: 16,
          y: 60 + (idx * 40) // Start lower to clear header, cascade vertically
        };

        size = {
          width: width,
          height: 500 // Reasonable height for mobile content
        };
      }

      return {
        id: w.id,
        title: w.title,
        icon: w.icon,
        isOpen: true,
        isMinimized: w.id === 'resume',
        isMaximized: false,
        zIndex: 10 + idx,
        position,
        size,
      };
    });
  });

  const [highestZ, setHighestZ] = useState(15);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowDock(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Show dock when 20% of the desktop is visible
        rootMargin: "-100px 0px 0px 0px"
      }
    );

    if (desktopRef.current) {
      observer.observe(desktopRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const focusWindow = (id: string) => {
    setHighestZ(prev => prev + 1);
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: highestZ + 1 } : w))
    );
  };

  const closeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const restoreWindow = (id: string) => {
    focusWindow(id);
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: false, isOpen: true } : w))
    );
  };

  const handleTaskbarClick = (id: string) => {
    const w = windows.find(win => win.id === id);
    if (!w) return;

    const isVisible = w.isOpen && !w.isMinimized;

    if (isVisible) {
      // If visible, check if it's the focused (top-most) window
      // We look for any other visible window with a higher z-index
      const isFocused = !windows.some(other =>
        other.id !== id &&
        other.isOpen &&
        !other.isMinimized &&
        other.zIndex > w.zIndex
      );

      if (isFocused) {
        // If it's the top window, toggle it off (minimize)
        minimizeWindow(id);
        return;
      }
    }

    // If minimized, closed, or behind other windows -> Bring to front
    restoreWindow(id);
  };

  const updatePosition = (id: string, position: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, position } : w))
    );
  };

  const updateSize = (id: string, size: { width: number; height: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, size } : w))
    );
  };

  return (
    <section
      id="desktop"
      key="desktop-cascade-step-v2"
      ref={desktopRef}
      className="min-h-screen relative pt-24 pb-4 overflow-hidden flex flex-col"
    >
      {/* Desktop Background with subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.03)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />


      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 relative z-20 shrink-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-green-500 font-mono">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">System Workspace</span>
          </div>
          <span className="text-neutral-600 text-xs">// Drag header to move • Drag corner to resize • Use controls to minimize/maximize</span>
        </div>
      </div>

      {/* Desktop Area with Drag Constraints */}
      <div
        ref={constraintsRef}
        className="flex-1 relative w-full"
        style={{ minHeight: '700px' }}
      >
        <AnimatePresence>
          {WINDOWS_CONFIG.map(config => {
            const windowState = windows.find(w => w.id === config.id)!;
            return (
              <TerminalWindow
                key={config.id}
                id={config.id}
                title={config.title}
                icon={config.icon}
                windowState={windowState}
                onClose={() => closeWindow(config.id)}
                onMinimize={() => minimizeWindow(config.id)}
                onMaximize={() => maximizeWindow(config.id)}
                onFocus={() => focusWindow(config.id)}
                onPositionChange={(pos) => updatePosition(config.id, pos)}
                onSizeChange={(size) => updateSize(config.id, size)}
                dragConstraints={constraintsRef}
              >
                {config.component}
              </TerminalWindow>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dock / Taskbar - Only visible when Desktop is in view */}
      <AnimatePresence>
        {showDock && (
          // @ts-ignore
          <motion.div
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 z-[60]"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-black/95 backdrop-blur-xl border border-green-500/20 rounded-xl shadow-2xl">
              {WINDOWS_CONFIG.map(config => {
                const windowState = windows.find(w => w.id === config.id)!;
                const isActive = windowState.isOpen && !windowState.isMinimized;

                return (
                  <button
                    key={config.id}
                    onClick={() => handleTaskbarClick(config.id)}
                    className={`group relative p-3 rounded-lg transition-all duration-300 ${isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-neutral-800/50 text-neutral-500 hover:text-green-400 hover:bg-neutral-700/50'
                      }`}
                  >
                    {config.icon}

                    {/* Active/Minimized indicator dot */}
                    {windowState.isOpen && (
                      <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                    )}

                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-green-500/30 rounded text-[10px] text-green-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {config.title}
                      {windowState.isMinimized && ' (minimized)'}
                      {!windowState.isOpen && ' (closed)'}
                    </span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="w-px h-8 bg-green-500/20 mx-2" />

              {/* System Info */}
              <div className="flex items-center gap-2 px-2 text-[10px] text-neutral-600 font-mono">
                <Cpu className="w-3 h-3" />
                <span className="hidden sm:inline">SYS_OK</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WindowsDesktop;
