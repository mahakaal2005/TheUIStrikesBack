'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Accessibility, Activity } from 'lucide-react';
import { z } from 'zod';
import { withInteractable } from '@tambo-ai/react';

export const bodyMapSchema = z.object({
    highlightedRegions: z.array(z.string()).optional().describe("List of body regions to highlight (e.g., ['head', 'chest', 'stomach', 'left_arm', 'right_arm', 'left_leg', 'right_leg'])"),
});

type BodyMapProps = z.infer<typeof bodyMapSchema>;

// SVG Paths for body regions
const BODY_PATHS = {
    head: "M100,50 C100,35 115,20 135,20 C155,20 170,35 170,50 C170,65 155,80 135,80 C115,80 100,65 100,50 Z",
    chest: "M105,85 L165,85 L160,140 L110,140 Z",
    stomach: "M110,145 L160,145 L160,190 L110,190 Z",
    left_arm: "M170,90 L200,100 L190,180 L165,140",
    right_arm: "M100,90 L70,100 L80,180 L105,140",
    left_leg: "M138,195 L158,195 L155,300 L140,300 Z",
    right_leg: "M132,195 L112,195 L115,300 L130,300 Z"
};

const LABEL_POSITIONS = {
    head: { top: '5%', left: '50%' },
    chest: { top: '25%', left: '50%' },
    stomach: { top: '42%', left: '50%' },
    left_arm: { top: '30%', left: '75%' },
    right_arm: { top: '30%', left: '25%' },
    left_leg: { top: '70%', left: '60%' },
    right_leg: { top: '70%', left: '40%' },
};

export const BodyMapSelectorBase = ({ highlightedRegions = [] }: BodyMapProps) => {
    // Normalize regions for comparison
    const activeRegions = highlightedRegions?.map(r => r.toLowerCase().replace(' ', '_')) || [];

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col items-center max-w-sm w-full transition-all duration-300 hover:shadow-xl">
            <div className="flex w-full items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Activity size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Symptom Map</h2>
                </div>
                {activeRegions.length > 0 && (
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full animate-pulse border border-red-100">
                        {activeRegions.length} Detected
                    </span>
                )}
            </div>

            <div className="relative w-64 h-80">
                {/* Interactive Body SVG */}
                <svg viewBox="0 0 270 320" className="w-full h-full drop-shadow-lg">
                    {/* Defs for glows */}
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Silhouette Background (ghost) */}
                    <g className="opacity-10 fill-slate-800">
                        {Object.values(BODY_PATHS).map((d, i) => (
                            <path key={i} d={d} stroke="none" />
                        ))}
                    </g>

                    {/* Connectors/Joints simplification */}
                    <path
                        d="M135,80 L135,85"
                        stroke="#cbd5e1"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Render Regions */}
                    {Object.entries(BODY_PATHS).map(([key, d]) => {
                        const isActive = activeRegions.includes(key);
                        return (
                            <path
                                key={key}
                                d={d}
                                className={cn(
                                    "transition-all duration-500 ease-in-out cursor-pointer",
                                    isActive
                                        ? "fill-red-500 stroke-red-600 stroke-2"
                                        : "fill-slate-100 stroke-slate-300 stroke-1 hover:fill-slate-200"
                                )}
                                filter={isActive ? "url(#glow)" : undefined}
                            />
                        );
                    })}
                </svg>

                {/* Overlaid Labels for Active Regions */}
                {Object.entries(LABEL_POSITIONS).map(([key, pos]) => {
                    const isActive = activeRegions.includes(key);
                    if (!isActive) return null;
                    return (
                        <div
                            key={key}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{ top: pos.top, left: pos.left }}
                        >
                            <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap z-10 animate-in fade-in zoom-in duration-300">
                                {key.replaceAll('_', ' ').toUpperCase()}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-6 w-full">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Reported Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                        {activeRegions.length > 0 ? (
                            activeRegions.map((region) => (
                                <span key={region} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {region.replaceAll('_', ' ')}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-slate-400 italic">No symptoms currently mapped.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BodyMapSelector = withInteractable(BodyMapSelectorBase, {
    componentName: "BodyMapSelector",
    description: "Visual body map to highlight regions where the patient is experiencing symptoms or pain.",
    propsSchema: bodyMapSchema
});
