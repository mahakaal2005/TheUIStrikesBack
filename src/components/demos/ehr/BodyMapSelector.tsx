'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { z } from 'zod';
import { withInteractable } from '@tambo-ai/react';
import { Badge } from '@/components/ui/badge';

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

const LABEL_POSITIONS: Record<string, { x: number, y: number }> = {
    head: { x: 135, y: 40 },
    chest: { x: 135, y: 110 },
    stomach: { x: 135, y: 160 },
    left_arm: { x: 185, y: 140 },
    right_arm: { x: 85, y: 140 },
    left_leg: { x: 145, y: 250 },
    right_leg: { x: 125, y: 250 },
};

export const BodyMapSelectorBase = ({ highlightedRegions = [] }: BodyMapProps) => {
    // Normalize regions for comparison
    const activeRegions = highlightedRegions?.map(r => r.toLowerCase().replace(' ', '_')) || [];

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
            <div className="relative w-48 flex-1 min-h-[300px]">
                <svg viewBox="0 0 270 320" className="w-full h-full drop-shadow-xl filter">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Body Silhouette */}
                    <g className="opacity-90">
                        {Object.entries(BODY_PATHS).map(([region, path]) => {
                            const isHighlighted = activeRegions.includes(region);

                            return (
                                <path
                                    key={region}
                                    d={path}
                                    fill={isHighlighted ? '#ef4444' : '#f1f5f9'}
                                    stroke={isHighlighted ? '#dc2626' : '#cbd5e1'}
                                    strokeWidth={isHighlighted ? 2 : 1}
                                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                                    filter={isHighlighted ? "url(#glow)" : ""}
                                />
                            );
                        })}
                    </g>

                    {/* Labels for Highlighted Areas */}
                    {activeRegions.map(region => {
                        const pos = LABEL_POSITIONS[region];
                        if (!pos) return null;

                        return (
                            <g key={`label-${region}`}>
                                <rect x={pos.x - 20} y={pos.y - 12} width="40" height="16" rx="8" fill="#dc2626" />
                                <text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="8"
                                    fontWeight="bold"
                                    className="uppercase"
                                >
                                    {region.replace('_', ' ')}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* Legend / Status */}
            <div className="mt-4 w-full bg-slate-50 rounded-xl p-3 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reported Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                    {activeRegions.map(region => (
                        <Badge key={region} variant="secondary" className="bg-white border border-slate-200 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                            {region.replace('_', ' ')}
                        </Badge>
                    ))}
                    {(!activeRegions || activeRegions.length === 0) && (
                        <span className="text-xs text-slate-400 italic">No specific regions highlighted</span>
                    )}
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
