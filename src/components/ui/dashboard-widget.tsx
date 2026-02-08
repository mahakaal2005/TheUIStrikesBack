"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const DashboardWidget = ({
    title,
    icon: Icon,
    children,
    defaultOpen = true,
    className = ""
}: DashboardWidgetProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn(
            "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all duration-300",
            isOpen ? 'h-full' : 'h-auto',
            className
        )}>
            {/* Header */}
            <div
                className="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Icon size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
                </div>
                <button className="text-slate-400 hover:text-blue-600 transition-colors">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {/* Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-1 overflow-hidden flex flex-col"
                    >
                        <div className="p-4 h-full flex flex-col">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
