'use client';

import React from 'react';
import { PatientVitalsCard } from '@/components/demos/ehr/PatientVitalsCard';
import { BodyMapSelector } from '@/components/demos/ehr/BodyMapSelector';
import { PrescriptionPad } from '@/components/demos/ehr/PrescriptionPad';
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { MedicalProvider } from "@/contexts/MedicalContext";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";

export default function EHRPage() {
    const mcpServers = useMcpServers();

    return (
        <TamboProvider
            apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
            components={components}
            tools={tools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
        >
            <MedicalProvider>
                <div className="flex h-screen bg-slate-50">
                    {/* Left: Chat/Transcript Log */}
                    <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Transcript</h2>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            {/* Using MessageThreadFull for the complete chat experience */}
                            <MessageThreadFull />
                        </div>
                    </div>

                    {/* Right: The "Patient Chart" (Generative UI Area) */}
                    <div className="w-2/3 p-8 overflow-y-auto">
                        <div className="max-w-xl mx-auto space-y-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Chart</h1>

                            {/* Components rendered here will be "live" if they are wrapped with withInteractable */}
                            {/* We are passing initial/default props, but Tambo should take over if it targets them */}

                            {/* Vitals Section */}
                            <PatientVitalsCard
                                heartRate={72}
                                bloodPressure="120/80"
                                temperature={98.6}
                                oxygenSat={98}
                            />

                            {/* Body Map Section */}
                            <BodyMapSelector highlightedRegions={[]} />

                            {/* Prescription Section */}
                            <PrescriptionPad />
                        </div>
                    </div>
                </div>
            </MedicalProvider>
        </TamboProvider>
    );
}
