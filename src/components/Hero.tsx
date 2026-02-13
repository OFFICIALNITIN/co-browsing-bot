"use client";
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// Cast motion.div to any to work around Framer Motion 11's TypeScript issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionDiv: any = motion.div;
import { ArrowRight, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { TypewriterEffect } from './ui/Typewriter';
import { RESUME_DATA } from '../constants';
import InteractiveTerminal from './InteractiveTerminal';
import SystemStatus from './SystemStatus';

const Hero: React.FC = () => {
  const [ping, setPing] = useState<number>(0);

  useEffect(() => {
    // @ts-ignore
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      setPing(conn.rtt || 0);
      conn.addEventListener('change', () => {
        setPing(conn.rtt || 0);
      });
    }
  }, []);

  const words = [
    { text: "Full", className: "text-neutral-400" },
    { text: "Stack", className: "text-neutral-400" },
    { text: "Engineer", className: "text-white text-glow" }
  ];

  // Mouse interaction for 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden antialiased">

      {/* Clock - Only visible in Hero section */}
      <SystemStatus />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-20">
            {/* System Online Badge with Ping */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <MotionDiv
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-3 px-3 py-1.5 rounded-sm border border-white/20 bg-black/40 text-white text-sm font-mono backdrop-blur-sm group hover:border-white/40 transition-colors cursor-default"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-neutral-300">System Online</span>
                </div>

                {/* Divider */}
                <div className="w-px h-3 bg-white/20" />

                {/* Ping */}
                <span className="text-green-500/80 font-bold text-xs">
                  {ping > 0 ? `${ping}ms` : '--'}
                </span>
              </MotionDiv>
            </div>


            <div className="mb-8 h-32 md:h-auto flex items-center md:items-start justify-center md:justify-start">
              {/* @ts-ignore */}
              <TypewriterEffect words={words} className="!text-3xl !md:text-5xl !lg:text-6xl !text-left leading-tight" cursorClassName="bg-white h-8 md:h-12 lg:h-16" />
            </div>

            <MotionDiv
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="mt-4 mb-8 max-w-lg mx-auto md:mx-0 w-full"
            >
              <InteractiveTerminal />
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <a
                href="/nitin_jangid_resume.pdf"
                download="Nitin_Jangid_Resume.pdf"
                className="inline-flex h-12 items-center justify-center rounded-sm border border-white/20 bg-black/50 hover:bg-white/10 hover:text-white text-neutral-300 px-6 font-medium group backdrop-blur-sm transition-all"
              >
                <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">./</span>
                Download CV
                <Download className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </MotionDiv>
          </div>

          {/* Developer Image - Terminal Identity Scanner Style */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex-1 relative max-w-md md:max-w-xl flex justify-center md:justify-end"
            style={{ perspective: "1000px" }}
          >
            <style>{`
               @keyframes scan-vertical {
                 0% { top: 0%; opacity: 0; }
                 15% { opacity: 1; }
                 85% { opacity: 1; }
                 100% { top: 100%; opacity: 0; }
               }
               .scan-line {
                 animation: scan-vertical 3s linear infinite;
               }
             `}</style>

            {/* 3D Tilt Container */}
            <MotionDiv
              className="relative group p-4 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
            >
              {/* Decorative Background Elements */}
              <div
                className="absolute top-0 right-10 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse -z-10"
                style={{ transform: "translateZ(-20px)" }}
              />
              <div
                className="absolute bottom-10 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -z-10"
                style={{ transform: "translateZ(-20px)" }}
              />

              {/* Main ID Card Container */}
              <div
                className="relative bg-black/90 border border-green-500/30 p-2 shadow-[0_0_20px_rgba(34,197,94,0.1)] backdrop-blur-sm"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Dynamic Glare Effect */}
                <MotionDiv
                  className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                  style={{
                    background: useTransform(
                      [mouseX, mouseY],
                      ([x, y]: any) => `radial-gradient(circle at ${50 + x * 100}% ${50 + y * 100}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
                    ),
                    transform: "translateZ(1px)"
                  }}
                />

                {/* Corner Brackets */}
                <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

                {/* Inner Image Frame */}
                <div
                  className="relative w-80 h-80 md:w-[400px] md:h-[400px] overflow-hidden bg-black"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {/* The Image */}
                  <img
                    src={RESUME_DATA.avatar}
                    alt="Identity Scan"
                    className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:brightness-100 transition-all duration-500 opacity-80"
                  />

                  {/* Matrix/Terminal Overlays */}
                  <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,0,0,0.5)_2px)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:20px_100%] pointer-events-none opacity-20"></div>

                  {/* Animated Scan Line */}
                  <div className="scan-line absolute left-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10"></div>

                  {/* Scanner UI Elements */}
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-green-400/70 border border-green-500/30 px-1 backdrop-blur-md">
                    REC: ON
                  </div>
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono text-green-400/70 backdrop-blur-md">
                    ISO: 800
                  </div>

                  {/* Crosshair following mouse slightly */}
                  <MotionDiv
                    className="absolute w-full h-full top-0 left-0 pointer-events-none z-20"
                    style={{ x: useTransform(mouseX, [-0.5, 0.5], [-10, 10]), y: useTransform(mouseY, [-0.5, 0.5], [-10, 10]) }}
                  >
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-green-500/50 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-[1px] h-8 bg-green-500/30 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-8 h-[1px] bg-green-500/30 -translate-x-1/2 -translate-y-1/2"></div>
                  </MotionDiv>
                </div>

                {/* Data Panel Below Image */}
                <div
                  className="mt-2 border-t border-green-500/30 pt-2 font-mono text-xs text-green-500/80 grid grid-cols-2 gap-y-1"
                  style={{ transform: "translateZ(10px)" }}
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] text-green-500/40 uppercase">Subject</span>
                    <span>{RESUME_DATA.name.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] text-green-500/40 uppercase">Status</span>
                    <span className="flex items-center gap-1">
                      VERIFIED <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 mt-1 text-[8px] text-green-500/50">
                    <span>ID: 0x84F2-A9</span>
                    <span className="flex-1 h-[1px] bg-green-500/20"></span>
                    <span>SEC_LVL: 5</span>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>

      {/* Background gradients - kept but subtle */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};

export default Hero;