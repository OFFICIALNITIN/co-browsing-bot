"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SystemStatus: React.FC = () => {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return null;

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ms = time.getMilliseconds().toString().padStart(3, '0').substring(0, 2);
    const hexTime = `0x${hours}${minutes}${seconds}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-6 right-6 z-50 font-mono hidden md:flex flex-col items-end pointer-events-none mix-blend-difference"
        >
            <div className="flex flex-col items-end gap-0.5 font-mono">
                {/* Main Time */}
                <div className="flex items-end gap-2 leading-none text-white">
                    <span className="text-4xl font-bold tracking-tighter">
                        {hours}:{minutes}
                    </span>
                    <div className="text-xl text-neutral-400 mb-1">
                        {seconds}
                    </div>
                </div>
            </div>

            {/* Dynamic Data Row */}
            <div className="flex items-center gap-3 mt-2 text-[10px] tracking-[0.2em] text-green-500 font-bold">
                <span className="opacity-50">SYS.TIME</span>
                <span>{hexTime}</span>
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span>{ms}</span>
            </div>

            {/* Location / Date */}
            <div className="text-[10px] text-green-500/80 font-bold tracking-widest mt-1 uppercase opacity-50">
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: '2-digit' })}
            </div>

            {/* Decorative bars */}
            <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-white/20"
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default SystemStatus;
