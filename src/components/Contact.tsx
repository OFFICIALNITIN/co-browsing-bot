import React from 'react';
import { Mail, MapPin, Linkedin, Github, Globe, Phone } from 'lucide-react';
import { RESUME_DATA } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden z-20">
        <div className="max-w-4xl mx-auto px-4 relative z-20">
            
            {/* Header */}
            <div className="text-center mb-16">
                 <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-mono text-xs">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     <span>CHANNEL_OPEN</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Establish Connection</h2>
                 <p className="text-neutral-400 max-w-lg mx-auto font-mono text-sm leading-relaxed">
                    Ready to collaborate? Locate and connect via secure channels.
                 </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Contact Card */}
                <div className="bg-black border border-white/10 rounded-lg p-8 flex flex-col justify-between group hover:border-green-500/30 transition-colors">
                     <div>
                        <h3 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                            <span className="text-green-500">&gt;</span> Direct_Comms
                        </h3>
                        
                        <div className="space-y-6">
                            
                            {/* Email */}
                            <a href={`mailto:${RESUME_DATA.email}`} className="flex items-start gap-4 group/item">
                                <div className="p-3 bg-neutral-900 rounded border border-white/10 text-neutral-400 group-hover/item:text-green-400 group-hover/item:border-green-500/50 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xs text-neutral-500 font-mono block mb-1">EMAIL_TARGET</span>
                                    <span className="text-white font-mono text-sm md:text-base break-all group-hover/item:text-green-400 transition-colors">
                                        {RESUME_DATA.email}
                                    </span>
                                </div>
                            </a>

                            {/* Phone */}
                            <div className="flex items-start gap-4 group/item">
                                <div className="p-3 bg-neutral-900 rounded border border-white/10 text-neutral-400 group-hover/item:text-green-400 group-hover/item:border-green-500/50 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xs text-neutral-500 font-mono block mb-1">VOICE_TARGET</span>
                                    <span className="text-white font-mono text-sm md:text-base">
                                        {RESUME_DATA.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-white/10 flex gap-4">
                        <a href={RESUME_DATA.linkedin} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-neutral-900 border border-white/10 rounded text-center text-sm text-neutral-300 font-mono hover:bg-white hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-2 group">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                        <a href={RESUME_DATA.github} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-neutral-900 border border-white/10 rounded text-center text-sm text-neutral-300 font-mono hover:bg-white hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-2 group">
                            <Github className="w-4 h-4" /> GitHub
                        </a>
                     </div>
                </div>

                {/* Location / Map Card */}
                <div className="bg-neutral-900/20 border border-white/10 rounded-lg overflow-hidden relative group hover:border-green-500/30 transition-colors min-h-[300px] flex flex-col">
                    
                    {/* Fake Map Visualization */}
                    <div className="absolute inset-0 opacity-40">
                         {/* Grid Pattern */}
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                         
                         {/* Radar Sweep */}
                         <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(34,197,94,0.1)_0deg,transparent_60deg)] animate-[spin_4s_linear_infinite]" />
                         
                         {/* Location Dot */}
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                              </span>
                         </div>
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-between pointer-events-none">
                         <div className="flex justify-between items-start">
                             <div className="bg-black/80 backdrop-blur px-3 py-1.5 rounded border border-green-500/30">
                                <span className="text-[10px] text-green-500 font-bold font-mono tracking-wider">SAT_VIEW_ACTIVE</span>
                             </div>
                             <MapPin className="text-white/20 w-8 h-8" />
                         </div>

                         <div>
                            <div className="text-5xl font-black text-white/10 absolute bottom-4 right-4 leading-none select-none">PUNE</div>
                            <h3 className="text-2xl font-bold text-white mb-1">{RESUME_DATA.location}</h3>
                            <div className="text-neutral-400 text-sm font-mono flex items-center gap-2">
                                <Globe className="w-3 h-3" />
                                <span>Coordinates: 18.5204° N, 73.8567° E</span>
                            </div>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default Contact;