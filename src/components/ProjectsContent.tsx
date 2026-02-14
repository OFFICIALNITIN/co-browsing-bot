"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Github, ExternalLink, Terminal, Eye, Cpu, Globe, X } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project; idx: number; onQuickView: () => void }> = ({ project, idx, onQuickView }) => {
  return (
    // @ts-ignore
    <motion.div
      data-project={project.title.toLowerCase().replace(/\s+/g, '-')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.1 }}
      className="group relative bg-[#050505] border border-white/10 rounded-lg overflow-hidden flex flex-col hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300"
    >
      {/* Mini Terminal Header */}
      <div className="h-8 bg-neutral-900/80 border-b border-white/10 flex items-center justify-between px-3">
        <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 group-hover:text-green-400/80 transition-colors">
          <Cpu className="w-3 h-3" />
          {project.title.toLowerCase().replace(/\s+/g, '_')}.exe
        </div>
        <div className="w-8" />
      </div>

      {/* Project Image */}
      <div className="relative h-40 overflow-hidden border-b border-white/5 group-hover:border-green-500/20 transition-colors cursor-pointer" onClick={onQuickView}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(); }}
            className="p-2 rounded bg-black/80 border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); window.open(project.github, '_blank'); }}
            className="p-2 rounded bg-black/80 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
          >
            <Github className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col bg-[#050505]">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-3.5 h-3.5 text-green-500" />
          <h3 className="font-bold text-sm text-white font-mono tracking-tight group-hover:text-green-400 transition-colors">{project.title}</h3>
        </div>

        <p className="text-neutral-500 text-xs leading-relaxed mb-4 font-mono border-l border-white/10 pl-3 group-hover:border-green-500/30 transition-colors line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10 text-neutral-400 hover:border-green-500/40 hover:text-green-400 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Status */}
      <div className="h-6 bg-neutral-900/50 border-t border-white/5 flex items-center justify-between px-3 text-[9px] text-neutral-600 font-mono">
        <span className="group-hover:text-green-500/70 transition-colors">STATUS: ACTIVE</span>
        <span>ID: {project.id.padStart(4, '0')}</span>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] overflow-y-auto font-mono">
    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      {/* @ts-ignore */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
      />

      {/* Spacer to center vertically if short, but allow scroll if long */}
      <div className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</div>

      {/* @ts-ignore */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative transform text-left w-full max-w-3xl bg-[#0a0a0a] border border-green-500/30 rounded-lg shadow-2xl flex flex-col md:flex-row md:h-auto my-8"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-30 p-1 bg-black/50 rounded-full text-neutral-500 hover:text-white hover:bg-red-500/20 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Left: Visual (Top on Mobile) */}
        <div className="w-full h-48 md:h-auto md:w-1/2 relative bg-black border-b md:border-b-0 md:border-r border-white/10 shrink-0 overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>

        {/* Right: Data (Bottom on Mobile) */}
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-[#0a0a0a] rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
          <div className="mb-6 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-green-500 text-xs mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SYSTEM_OVERVIEW
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{project.title}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-4 shrink-0">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-green-400 transition-all text-center rounded-sm"
            >
              <Globe className="w-4 h-4" /> Live Demo
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all text-center rounded-sm"
            >
              <Github className="w-4 h-4" /> Source
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

// Content-only version for embedding in TerminalWindow
const ProjectsContent: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="p-6 font-mono">
      {/* Command prompt simulation */}
      <div className="flex items-center gap-2 text-green-500 border-b border-neutral-800 pb-4 mb-6">
        <span className="font-bold">root@dev:~$</span>
        <span>./list_visual_modules.exe --grid-view</span>
        <span className="w-2 h-4 bg-green-500/50 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            idx={idx}
            onQuickView={() => setSelectedProject(project)}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between text-xs text-neutral-500">
        <span>Modules Loaded: {PROJECTS.length}</span>
        <span>Memory Usage: 128MB</span>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsContent;
