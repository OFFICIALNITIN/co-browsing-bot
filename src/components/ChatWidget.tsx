"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Minimize2, Terminal as TerminalIcon, Cpu, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { useCoBrowsing } from '../hooks/use-co-browsing';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Use a fixed date for initial render to prevent hydration mismatch
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Initializing AI Interface...\nSystem Ready.\nHow can I assist you with Nitin's portfolio today?", timestamp: new Date(0) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update the timestamp to now only on the client side
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[0].timestamp = new Date();
      return newMessages;
    });
  }, []);

  const { scrollToSection, highlightElement, navigate, fillForm } = useCoBrowsing();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini - must start with 'user' role
      const firstUserIdx = messages.findIndex(m => m.role === 'user');
      const relevantHistory = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : [];
      const history = relevantHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Execute Tools if any
      if (data.functionCalls && data.functionCalls.length > 0) {
        data.functionCalls.forEach((call: any) => {
          console.log("Executing Tool:", call.name, call.args);

          if (call.name === 'scrollToSection') {
            scrollToSection(call.args.sectionId);
          } else if (call.name === 'highlightElement') {
            highlightElement(call.args.selector);
          } else if (call.name === 'navigate') {
            navigate(call.args.path);
          } else if (call.name === 'fillForm') {
            fillForm(call.args.selector, call.args.value);
          }
        });
      }

      const botText = data.text || (data.functionCalls?.length > 0 ? "Executing requested actions..." : "I'm not sure how to respond to that.");

      const botMessage: ChatMessage = {
        role: 'model',
        text: botText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Chat Error", errMsg);
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${errMsg}`, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 font-mono">
        <AnimatePresence>
          {!isOpen && (
            // @ts-ignore
            <motion.button
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center justify-center w-14 h-14 bg-black border border-green-500/50 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:border-green-400 transition-all overflow-hidden"
            >
              {/* Scanline effect on button */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-50" />

              <MessageSquare className="w-6 h-6 text-green-500 group-hover:text-green-400 relative z-10" />

              {/* Ping notification */}
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          // @ts-ignore
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[420px] h-[600px] max-h-[80vh] flex flex-col font-mono"
          >
            {/* Main Container with blurred border effect */}
            <div className="relative w-full h-full bg-black/95 backdrop-blur-xl border border-green-500/30 rounded-lg shadow-2xl overflow-hidden flex flex-col">

              {/* Decor: glowing border */}
              <div className="absolute inset-0 border border-green-500/20 rounded-lg pointer-events-none z-50 shadow-[0_0_20px_rgba(34,197,94,0.05) inset]" />

              {/* Header */}
              <div className="shrink-0 p-3 bg-neutral-900/90 border-b border-green-500/20 flex justify-between items-center select-none drag-handle">
                <div className="flex items-center gap-3">
                  {/* Window Controls */}
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-colors cursor-pointer" onClick={() => setIsOpen(false)} />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 border border-yellow-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 border border-green-500/30" />
                  </div>

                  <div className="flex items-center gap-2 text-green-500">
                    <Cpu className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wider">AI_CORE_V2.1</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded bg-green-900/20 border border-green-500/20 text-[10px] text-green-400">
                    ONLINE
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 relative custom-scrollbar bg-black/50">
                {/* Background Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

                {messages.map((msg, idx) => (
                  // @ts-ignore
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx}
                    className={`flex flex-col relative z-10 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 opacity-50 px-1">
                      <span className="text-[10px] text-green-500/70 uppercase">
                        {msg.role === 'user' ? 'USER_CMD' : 'SYS_RESPONSE'}
                      </span>
                      <span className="text-[10px] text-neutral-600">
                        [{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                        ? 'bg-neutral-900 border border-neutral-700 text-neutral-200 shadow-sm'
                        : 'bg-green-950/10 border-l-2 border-green-500 text-green-400 pl-4'
                        }`}
                    >
                      {msg.text.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {msg.role === 'model' && <span className="mr-2 opacity-50">&gt;</span>}
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  // @ts-ignore
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-start"
                  >
                    <span className="text-[10px] text-green-500/70 mb-1 px-1 uppercase animate-pulse">Processing...</span>
                    <div className="bg-green-950/10 border-l-2 border-green-500/50 px-4 py-3 rounded flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-green-500 animate-pulse" />
                      <span className="text-green-500/50 text-sm">Thinking</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-neutral-900/90 border-t border-green-500/20 relative z-20">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1 group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-bold">&gt;</span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter command..."
                      className="w-full bg-black border border-neutral-700 rounded px-3 py-2.5 pl-7 text-sm text-green-400 focus:outline-none focus:border-green-500/50 focus:shadow-[0_0_10px_rgba(34,197,94,0.1)] transition-all placeholder:text-neutral-700 font-mono"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-3 bg-neutral-800 border border-neutral-700 hover:border-green-500/50 hover:bg-neutral-700 text-green-500 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="text-[9px] text-neutral-600 mt-2 text-center uppercase tracking-widest flex justify-between px-1">
                  <span>Secure Connection</span>
                  <span>Gemini-Pro Enforced</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;