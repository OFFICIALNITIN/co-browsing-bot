"use client";
import React, { useState, useRef, ReactNode } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Minus, Maximize2, X } from 'lucide-react';

export interface WindowState {
  id: string;
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface TerminalWindowProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  dragConstraints?: React.RefObject<Element | null>;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  id,
  title,
  icon,
  children,
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  dragConstraints,
}) => {
  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);

  if (!windowState.isOpen) return null;

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowState.size.width,
      startHeight: windowState.size.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current) return;
      const deltaX = moveEvent.clientX - resizeRef.current.startX;
      const deltaY = moveEvent.clientY - resizeRef.current.startY;

      const newWidth = Math.max(400, resizeRef.current.startWidth + deltaX);
      const newHeight = Math.max(300, resizeRef.current.startHeight + deltaY);

      onSizeChange({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    // @ts-ignore
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: windowState.isMinimized ? 0 : 1,
        scale: windowState.isMinimized ? 0.8 : 1,
        x: windowState.isMaximized ? 0 : windowState.position.x,
        y: windowState.isMaximized ? 0 : windowState.position.y,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      drag={!windowState.isMaximized && !isResizing}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(event, info) => {
        // Calculate new position
        let newX = windowState.position.x + info.offset.x;
        let newY = windowState.position.y + info.offset.y;

        // Get constraint bounds if available
        if (dragConstraints?.current) {
          const constraintRect = dragConstraints.current.getBoundingClientRect();
          const maxX = constraintRect.width - windowState.size.width;
          const maxY = constraintRect.height - windowState.size.height;

          // Clamp position to stay within bounds
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));
        }

        onPositionChange({ x: newX, y: newY });
      }}
      onClick={onFocus}
      style={{
        zIndex: windowState.zIndex,
        width: windowState.isMaximized ? 'auto' : windowState.size.width,
        height: windowState.isMaximized ? 'calc(100% - 60px)' : windowState.size.height,
        left: windowState.isMaximized ? '60px' : 0,
        right: windowState.isMaximized ? '60px' : 'auto',
        top: windowState.isMaximized ? '30px' : 0,
        pointerEvents: windowState.isMinimized ? 'none' : 'auto',
      }}
      className={`absolute font-mono ${windowState.isMinimized ? 'pointer-events-none' : ''}`}
    >
      <div className="relative w-full h-full bg-black/95 backdrop-blur-xl border border-green-500/30 rounded-lg shadow-2xl overflow-hidden flex flex-col">

        {/* Glowing border */}
        <div className="absolute inset-0 border border-green-500/10 rounded-lg pointer-events-none" />

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

        {/* Header - Drag Handle */}
        <div
          className="shrink-0 p-3 bg-neutral-900/95 border-b border-green-500/20 flex justify-between items-center cursor-grab active:cursor-grabbing select-none"
          onPointerDown={(e) => {
            if (!windowState.isMaximized && !isResizing) {
              dragControls.start(e);
            }
          }}
        >
          <div className="flex items-center gap-3">
            {/* Window Controls */}
            <div className="flex gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-colors flex items-center justify-center group"
              >
                <X className="w-2 h-2 opacity-0 group-hover:opacity-100 text-red-900" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 border border-yellow-500/30 transition-colors flex items-center justify-center group"
              >
                <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100 text-yellow-900" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 border border-green-500/30 transition-colors flex items-center justify-center group"
              >
                <Maximize2 className="w-1.5 h-1.5 opacity-0 group-hover:opacity-100 text-green-900" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-green-500">
              {icon}
              <span className="text-xs font-bold tracking-wider uppercase">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
            <span>{windowState.size.width}x{windowState.size.height}</span>
            <span>PID: {id.slice(0, 4)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/50">
          {children}
        </div>

        {/* Resize Handle */}
        {!windowState.isMaximized && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group z-50"
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-green-500/30 group-hover:border-green-500 transition-colors" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
