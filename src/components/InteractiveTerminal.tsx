"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Minus, Square } from 'lucide-react';
import { RESUME_DATA, PROJECTS, EXPERIENCE, SKILLS } from '../constants';

interface CommandHistory {
  id: number;
  command: string;
  output: React.ReactNode;
}

const InteractiveTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      id: 0,
      command: 'welcome',
      output: (
        <div className="mb-2">
          <span className="text-neutral-300">Welcome to {RESUME_DATA.name.split(' ')[0]}'s portfolio terminal. Type </span>
          <span className="text-green-400 font-bold">'help'</span>
          <span className="text-neutral-300"> to see available commands.</span>
        </div>
      )
    }
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Initial Auto-Run Command
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCommand('about');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Focus input on click
  const handleTerminalClick = () => {
    if (!isCollapsed) {
      inputRef.current?.focus();
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(' ').slice(1);
    const baseCmd = trimmedCmd.split(' ')[0];

    let output: React.ReactNode;

    switch (baseCmd) {
      case 'help':
        output = (
          <div className="space-y-1 my-1">
            <div className="text-neutral-400">Available commands:</div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-green-400 font-bold">about</span>
              <span>Display information about me</span>
              <span className="text-green-400 font-bold">skills</span>
              <span>List technical skills</span>
              <span className="text-green-400 font-bold">projects</span>
              <span>List my projects</span>
              <span className="text-green-400 font-bold">experience</span>
              <span>Show work history</span>
              <span className="text-green-400 font-bold">contact</span>
              <span>Show contact information</span>
              <span className="text-green-400 font-bold">resume</span>
              <span>Download/View CV</span>
              <span className="text-green-400 font-bold">social</span>
              <span>List social media links</span>
              <span className="text-green-400 font-bold">date</span>
              <span>Show current date/time</span>
              <span className="text-green-400 font-bold">echo [text]</span>
              <span>Print text to console</span>
              <span className="text-green-400 font-bold">joke</span>
              <span>Tell a developer joke</span>
              <span className="text-green-400 font-bold">clear</span>
              <span>Clear terminal history</span>
              <span className="text-green-400 font-bold">whoami</span>
              <span>Display current user status</span>
              <span className="text-green-400 font-bold">ls</span>
              <span>List directory contents</span>
              <span className="text-green-400 font-bold">cat [file]</span>
              <span>Read a file</span>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = <div className="text-blue-400">{RESUME_DATA.role}</div>;
        break;

      case 'about':
        output = <div className="max-w-md text-neutral-300">{RESUME_DATA.about}</div>;
        break;

      case 'ls':
        output = (
          <div className="flex flex-wrap gap-4 text-blue-400 font-bold">
            <span>about_me.txt</span>
            <span>skills/</span>
            <span>projects/</span>
            <span>experience/</span>
            <span>contact_info.json</span>
            <span>resume.pdf</span>
          </div>
        );
        break;

      case 'cat':
        if (args.length === 0) {
          output = <span className="text-red-400">Usage: cat [filename]</span>;
        } else if (args[0] === 'about_me.txt') {
          output = <div className="max-w-md text-neutral-300">{RESUME_DATA.about}</div>;
        } else if (args[0] === 'contact_info.json') {
          output = (
            <div className="text-neutral-300">
              <div>{'{'}</div>
              <div className="pl-4">"email": "{RESUME_DATA.email}",</div>
              <div className="pl-4">"github": "{RESUME_DATA.github}",</div>
              <div className="pl-4">"linkedin": "{RESUME_DATA.linkedin}"</div>
              <div>{'}'}</div>
            </div>
          );
        } else if (args[0] === 'resume.pdf') {
          output = <span className="text-neutral-300">Binary file (resume.pdf) cannot be displayed. Use <span className="text-green-400">'resume'</span> to download.</span>;
        } else {
          output = <span className="text-red-400">File not found: {args[0]}</span>;
        }
        break;

      case 'skills':
        output = (
          <div className="flex flex-wrap gap-2 text-neutral-300">
            {SKILLS.map(s => <span key={s.name} className="px-1 bg-white/10 rounded-sm">{s.name}</span>)}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2">
            {PROJECTS.map(p => (
              <div key={p.id}>
                <div className="text-blue-400 font-bold">{p.title}</div>
                <div className="text-neutral-400 text-xs">{p.description}</div>
              </div>
            ))}
            <div className="text-neutral-500 italic text-xs mt-1">Tip: Scroll down to see full visuals!</div>
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-2">
            {EXPERIENCE.map(e => (
              <div key={e.id}>
                <span className="text-green-400 font-bold">{e.role}</span>
                <span className="text-neutral-400"> @ {e.company}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
      case 'email':
        output = (
          <div className="text-neutral-300">
            <div>Email: <a href={`mailto:${RESUME_DATA.email}`} className="text-blue-400 hover:underline">{RESUME_DATA.email}</a></div>
            <div>GitHub: <a href={RESUME_DATA.github} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{RESUME_DATA.github}</a></div>
            <div>LinkedIn: <a href={RESUME_DATA.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{RESUME_DATA.linkedin}</a></div>
          </div>
        );
        break;

      case 'social':
        output = (
          <div className="space-y-1 text-neutral-300">
            <div><a href={RESUME_DATA.github} target="_blank" rel="noreferrer" className="hover:text-green-400 underline">GitHub</a></div>
            <div><a href={RESUME_DATA.linkedin} target="_blank" rel="noreferrer" className="hover:text-green-400 underline">LinkedIn</a></div>
          </div>
        );
        break;

      case 'resume':
      case 'cv':
        output = (
          <div className="text-green-400">
            Opening resume...
            <span className="text-xs text-neutral-500 block">(If it doesn't open, checks your pop-up blocker)</span>
            {/* Logic to simulate action - typically this would trigger a download link */}
          </div>
        );
        window.open('/resume.pdf', '_blank'); // Assuming file exists or placeholder
        break;

      case 'date':
        output = <div className="text-neutral-300">{new Date().toString()}</div>;
        break;

      case 'echo':
        output = <div className="text-neutral-300">{args.join(' ')}</div>;
        break;

      case 'rm':
        if (args.includes("-rf") && (args.includes("/") || args.includes("*"))) {
          output = <div className="text-red-500 font-bold animate-pulse">CRITICAL ERROR: SELF_Destruct_SEQUENCE_INITIATED... Just kidding. Don't try that again.</div>;
        } else {
          output = <div className="text-red-400">Permission denied: File system is read-only.</div>;
        }
        break;

      case 'joke':
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs.",
          "I told my computer I needed a break, and now it won't stop sending me Kit-Kat bars.",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
          "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
          "Documentation is like sex: when it's good, it's very good; when it's bad, it's better than nothing."
        ];
        output = <div className="text-yellow-400 italic">"{jokes[Math.floor(Math.random() * jokes.length)]}"</div>;
        break;

      case 'clear':
        setHistory([]);
        return; // Early return to avoid adding "clear" to history

      case 'sudo':
        output = <div className="text-red-500 font-bold">Permission denied: You are not authorized to perform this action.</div>;
        break;

      default:
        output = (
          <div className="text-red-400">
            Command not found: {baseCmd}. Type <span className="text-green-400 font-bold">'help'</span> for list of commands.
          </div>
        );
    }

    setHistory(prev => [...prev, { id: Date.now(), command: cmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!input.trim()) return;
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div
      className={`rounded-md bg-black/80 border border-white/20 overflow-hidden font-mono text-sm shadow-2xl relative group w-full backdrop-blur-md flex flex-col transition-all duration-300 ${isCollapsed ? 'h-[40px]' : 'h-[320px] md:h-[400px]'}`}
      onClick={handleTerminalClick}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/90 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 text-neutral-400" />
          <span className="text-xs text-neutral-400">nitin@portfolio: ~</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }}
            className="w-3 h-3 text-neutral-500 hover:text-white cursor-pointer focus:outline-none"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(false); }}
            className="w-3 h-3 text-neutral-500 hover:text-white cursor-pointer focus:outline-none"
            title="Maximize"
          >
            <Square className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {!isCollapsed && (
        <div ref={containerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar cursor-text">
          {history.map((entry) => (
            <div key={entry.id} className="mb-3">
              {entry.command !== 'welcome' && (
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-green-500 font-bold">nitin@dev:~$</span>
                  <span className="text-white">{entry.command}</span>
                </div>
              )}
              <div className="ml-0 text-neutral-300 leading-relaxed">
                {entry.output}
              </div>
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-green-500 font-bold">nitin@dev:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-white flex-1 min-w-[50px] font-mono caret-white"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveTerminal;
