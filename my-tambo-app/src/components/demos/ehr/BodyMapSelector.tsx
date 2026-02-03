'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Accessibility } from 'lucide-react';
import { z } from 'zod';
import { withInteractable } from '@tambo-ai/react';

export const bodyMapSchema = z.object({
    highlightedRegions: z.array(z.string()).optional().describe("List of body regions to highlight (e.g., ['head', 'chest'])"),
});

type BodyMapProps = z.infer<typeof bodyMapSchema>;

// Simple representation of body regions for MVP
const regions = [
    { id: 'head', label: 'Head', top: '10%', left: '50%' },
    { id: 'chest', label: 'Chest', top: '30%', left: '50%' },
    { id: 'stomach', label: 'Stomach', top: '45%', left: '50%' },
    { id: 'left_arm', label: 'L. Arm', top: '35%', left: '70%' },
    { id: 'right_arm', label: 'R. Arm', top: '35%', left: '30%' },
    { id: 'left_leg', label: 'L. Leg', top: '70%', left: '60%' },
    { id: 'right_leg', label: 'R. Leg', top: '70%', left: '40%' },
];

export const BodyMapSelectorBase = ({ highlightedRegions = [] }: BodyMapProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
            <div className="flex w-full items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
                <Accessibility className="text-blue-600" size={24} />
                <h2 className="text-lg font-semibold text-slate-800">Symptom Map</h2>
            </div>

            <div className="relative w-64 h-96 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                {/* Placeholder Body Image */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <Accessibility size={200} />
                </div>

                {regions.map((region) => {
                    const isHighlighted = highlightedRegions?.includes(region.id);
                    return (
                        <div
                            key={region.id}
                            className={cn(
                                "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300",
                                isHighlighted
                                    ? "w-16 h-16 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500"
                                    : "w-4 h-4 bg-slate-200 border border-slate-300 hover:bg-slate-300"
                            )}
                            style={{ top: region.top, left: region.left }}
                        >
                            {isHighlighted && (
                                <div className="absolute -bottom-8 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {region.label} Pain
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <p className="mt-4 text-sm text-slate-400 text-center">
                {highlightedRegions && highlightedRegions.length > 0
                    ? `Active Regions: ${highlightedRegions.join(', ')}`
                    : "No active symptoms detected"}
            </p>
        </div>
    );
};

export const BodyMapSelector = withInteractable(BodyMapSelectorBase, {
    componentName: "BodyMapSelector",
    description: "Visual body map to highlight regions where the patient is experiencing symptoms or pain.",
    propsSchema: bodyMapSchema
});
