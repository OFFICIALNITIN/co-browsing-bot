import React from 'react';
import { Download, ExternalLink, Printer } from 'lucide-react';

const ResumeContent: React.FC = () => {
  const resumeUrl = "/nitin_jangid_resume.pdf";

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] font-sans text-neutral-800">
      
      {/* Toolbar */}
      <div className="flex justify-between items-center p-3 border-b border-white/10 bg-neutral-900 text-white font-mono shrink-0">
        <div className="flex items-center gap-2">
           <span className="font-bold text-sm">nitin_jangid_resume.pdf</span>
           <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-neutral-400">READ ONLY</span>
        </div>
        <div className="flex gap-2">
            <a 
                href={resumeUrl} 
                download
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-xs font-bold transition-colors"
            >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
            </a>
            <a 
                href={resumeUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-xs font-bold transition-colors text-white"
            >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open New Tab</span>
            </a>
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div className="flex-1 w-full h-full bg-neutral-800 overflow-hidden relative">
        <iframe 
            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0"
            title="Resume PDF"
        />
        
        {/* Fallback for browsers that don't support iframe PDF rendering */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-neutral-900 -z-10">
            <p className="text-neutral-400 mb-4">Unable to render PDF directly.</p>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline pointer-events-auto">
                Click here to view PDF
            </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeContent;
