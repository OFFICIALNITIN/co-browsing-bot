"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Mail, Terminal, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const desktopSection = document.getElementById('desktop');
      if (desktopSection) {
        const rect = desktopSection.getBoundingClientRect();
        // Hide navbar if desktop section is largely in view (e.g., top is near top of viewport or within viewport)
        if (rect.top <= 100 && rect.bottom >= 100) {
          setHideNavbar(true);
        } else {
          setHideNavbar(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', icon: <User className="w-4 h-4" /> },
    { name: 'Desktop', href: '#desktop', icon: <Monitor className="w-4 h-4" /> },
    { name: 'Contact', href: '#contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    // @ts-ignore
    <motion.div
      animate={{ y: hideNavbar ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none" // pointer-events-none on wrapper to let clicks pass through when hidden? No, button needs pointer-events-auto
    >
      <nav className="fixed top-6 inset-x-0 max-w-fit mx-auto z-50 hidden md:flex items-center justify-center pointer-events-auto">
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-lg border border-white/20 px-2 py-2 rounded-lg shadow-2xl shadow-black/50">
          {/* Terminal Prompt Icon */}
          <div className="px-3 py-2 text-green-500 font-mono text-sm hidden lg:block">
            ➜ ~
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-4 py-2 rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2 font-mono group"
            >
              {hoveredLink === link.name && (
                <span className="absolute left-2 text-green-500 animate-pulse">_</span>
              )}
              <span className={`transition-transform duration-200 ${hoveredLink === link.name ? 'translate-x-2' : ''}`}>
                {link.name}
              </span>
            </a>
          ))}
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={() => window.open('https://github.com/OFFICIALNITIN', '_blank')}
            className="px-4 py-2 rounded-md text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-colors font-mono flex items-center gap-2 group"
          >
            <Terminal className="w-3 h-3" />
            <span className="group-hover:underline">git push</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-4 justify-between pointer-events-auto">
        <div className="flex items-center space-x-2">
          <span className="text-green-500 font-bold font-mono">➜</span>
          <span className="font-bold text-lg tracking-tight font-mono text-white">Nitin.dev</span>
          <span className="animate-pulse bg-white w-2 h-4 block"></span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none border border-white/20"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          // @ts-ignore
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/20 md:hidden overflow-hidden pointer-events-auto"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-neutral-300 hover:text-white hover:bg-white/5 block px-4 py-3 rounded-sm text-base font-medium flex items-center gap-3 font-mono border-l-2 border-transparent hover:border-green-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-neutral-500">&gt;</span> {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;