"use client";
import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { EXPERIENCE } from '../constants';
import { Calendar, Activity } from 'lucide-react';

const MotionDiv = motion.div as React.FC<HTMLMotionProps<'div'> & { className?: string }>;

// Content-only version for embedding in TerminalWindow
const ExperienceContent: React.FC = () => {
  return (
    <div className="p-6 space-y-6 font-mono">
      {/* Command prompt simulation */}
      <div className="flex items-center gap-2 text-green-500 border-b border-neutral-800 pb-4">
        <span className="font-bold">root@dev:~$</span>
        <span>./show_experience_log.sh --interactive</span>
        <span className="w-2 h-4 bg-green-500/50 animate-pulse" />
      </div>

      <div className="space-y-6 relative">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-4 bottom-0 w-px bg-neutral-800" />
        <div className="absolute left-[19px] top-4 w-px h-full bg-gradient-to-b from-green-500/50 to-transparent" />

        {EXPERIENCE.map((job, idx) => (
          <MotionDiv
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="relative pl-12 group"
          >
            {/* Timeline Node */}
            <div className="absolute left-0 top-0 w-10 h-6 bg-neutral-900 border border-neutral-700 text-[10px] text-neutral-400 flex items-center justify-center rounded z-20 font-bold font-mono group-hover:border-green-500 group-hover:text-green-500 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-300">
              LOG::{idx + 1}
            </div>

            {/* Active Dot */}
            <div className="absolute left-[16px] top-[24px] w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />

            {/* Experience Card */}
            <div className="bg-neutral-900/30 border border-white/5 rounded p-5 hover:border-green-500/30 hover:bg-neutral-900/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:translate-x-1">
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-white/5 pb-3 group-hover:border-white/10 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-green-400 font-bold text-lg group-hover:text-green-300 transition-colors">
                    <span className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300">&gt;</span>
                    {job.role}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1">
                    <span className="text-neutral-600">at</span>
                    <span className="text-blue-400 font-bold tracking-wide group-hover:text-blue-300 transition-colors">{job.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono">
                  <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded text-neutral-400 group-hover:text-white transition-colors">
                    <Calendar className="w-3 h-3" />
                    {job.period}
                  </div>
                  <div className="flex items-center gap-1 text-green-500/70 group-hover:text-green-400 group-hover:animate-pulse">
                    <Activity className="w-3 h-3" />
                    <span>Active Process</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 font-mono text-sm">
                {job.description.map((point, i) => (
                  <div key={i} className="flex gap-3 text-neutral-400 hover:text-white transition-colors hover:translate-x-1 duration-200">
                    <span className="text-neutral-600 select-none group-hover:text-green-500/50">$</span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between text-xs text-neutral-500">
        <span>Total Runtime: 2 years, 4 months</span>
        <span>End of Log</span>
      </div>
    </div>
  );
};

export default ExperienceContent;
