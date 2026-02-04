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

import { useHealthcare } from "@/contexts/HealthcareContext";

export default function EHRPage() {
    const mcpServers = useMcpServers();
    const { addLabOrder } = useHealthcare();

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

                            {/* Quick Navigation for Demo */}
                            <div className="pt-8 border-t border-slate-200 mt-8">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ecosystem Quick Links</h3>
                                <div className="flex gap-4">
                                    <a href="/demos/patient" target="_blank" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
                                        Open Patient Portal
                                    </a>
                                    <a href="/demos/lab" target="_blank" className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200">
                                        Open Lab Portal
                                    </a>
                                    <a href="/demos/pharmacy" target="_blank" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200">
                                        Open Pharmacy Portal
                                    </a>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => addLabOrder({
                                            patientId: 'p-123',
                                            testName: 'Complete Blood Count (CBC)',
                                            notes: 'Check for infection'
                                        })}
                                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                                    >
                                        [Debug] Simulate: Order Blood Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MedicalProvider>
        </TamboProvider>
    );
}
