"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../constants';
import { Code, Server, Box, Hash, Activity } from 'lucide-react';

const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&@$';

  const handleHover = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if (index < iterations) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 2;
    }, 30);
  };

  return (
    <span onMouseEnter={handleHover} className="inline-block">
      {displayText}
    </span>
  );
};

const StatusIndicator: React.FC = () => {
  const [status, setStatus] = useState('[OK]');
  const [color, setColor] = useState('text-green-500/80');

  const handleEnter = () => {
    setStatus('[SCAN...]');
    setColor('text-yellow-400');
    setTimeout(() => {
      setStatus('[VERIFIED]');
      setColor('text-blue-400');
    }, 600);
    setTimeout(() => {
      setStatus('[OK]');
      setColor('text-green-500/80');
    }, 2000);
  };

  return (
    <span
      onMouseEnter={handleEnter}
      className={`text-[10px] font-mono transition-colors cursor-help ${color}`}
    >
      {status}
    </span>
  );
};

const categoryPaths: Record<string, string> = {
  frontend: '/usr/local/frontend',
  backend: '/var/www/backend',
  tools: '/opt/devtools'
};

const getIcon = (category: string) => {
  switch (category) {
    case 'frontend': return <Code className="w-4 h-4 text-blue-400" />;
    case 'backend': return <Server className="w-4 h-4 text-green-400" />;
    case 'tools': return <Box className="w-4 h-4 text-yellow-400" />;
    default: return <Hash className="w-4 h-4 text-neutral-400" />;
  }
}

// Content-only version for embedding in TerminalWindow
const SkillsContent: React.FC = () => {
  const categories = Array.from(new Set(SKILLS.map(s => s.category)));

  return (
    <div className="p-6 space-y-6 font-mono">
      {/* Command prompt simulation */}
      <div className="flex items-center gap-2 text-green-500 border-b border-neutral-800 pb-4">
        <span className="font-bold">root@dev:~$</span>
        <span>./list_capabilities.sh --verbose</span>
        <span className="w-2 h-4 bg-green-500/50 animate-pulse" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {categories.map((category, catIndex) => (
          // @ts-ignore
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="bg-neutral-900/30 rounded p-4 border border-white/5 hover:border-green-500/20 transition-colors"
          >
            {/* Category Header */}
            <div className="flex items-center gap-2 text-yellow-400 mb-4 pb-2 border-b border-white/5">
              {getIcon(category)}
              <span className="text-sm font-bold tracking-wider uppercase">
                {categoryPaths[category] || `./${category}`}
              </span>
            </div>

            {/* Skills List */}
            <ul className="space-y-2">
              {SKILLS.filter(s => s.category === category).map((skill, index) => (
                // @ts-ignore
                <motion.li
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                  className="group flex items-center justify-between hover:bg-white/5 p-1 rounded px-2 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-green-500/80 group-hover:text-green-400 group-hover:font-bold text-sm transition-all">
                      <GlitchText text={skill.name.toLowerCase()} />
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusIndicator />
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Directory Footer */}
            <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-neutral-600 flex justify-between">
              <span>{SKILLS.filter(s => s.category === category).length} files</span>
              <span>{(category.length * 2.5 + 1).toFixed(1)}KB</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between text-xs text-neutral-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> CPU: 12%</span>
          <span>Mem: 48% used</span>
        </div>
        <span>Process finished with exit code 0</span>
      </div>
    </div>
  );
};

export default SkillsContent;
